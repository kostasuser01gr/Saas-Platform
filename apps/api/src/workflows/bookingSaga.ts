import { proxyActivities, sleep } from '@temporalio/workflow';
import type * as activities from '../activities/bookingActivities';

const { 
  validateInventory, 
  holdFunds, 
  chargeCustomer, 
  dispatchCleaner, 
  releaseHold 
} = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
});

/**
 * 🌍 TIER 3: Workflow Engine (Temporal.io)
 * Long-running Distributed Transaction for Car Rentals.
 * Guaranteed to complete or rollback safely, even if backend crashes.
 */
export async function carRentalBookingSaga(bookingId: string, customerId: string, vehicleId: string, rentalDurationDays: number): Promise<string> {
  let fundsHeld = false;
  
  try {
    // Step 1: Check physical inventory
    const available = await validateInventory(vehicleId);
    if (!available) throw new Error('Vehicle unavailable');

    // Step 2: Hold funds (Pre-Authorization)
    await holdFunds(customerId, 500); // $500 Deposit
    fundsHeld = true;

    // Step 3: Wait for the rental period to end (can be days/weeks)
    // Temporal suspends this function and uses zero CPU while waiting.
    await sleep(`${rentalDurationDays} days`);

    // Step 4: Finalize payment based on actual usage/damage
    await chargeCustomer(customerId, bookingId);
    
    // Step 5: Dispatch the cleaner via internal ops (kinsen-ops)
    await dispatchCleaner(vehicleId);

    return 'COMPLETED';
    
  } catch (err) {
    // SAGA Compensation Logic (Auto-Rollback)
    if (fundsHeld) {
      await releaseHold(customerId);
    }
    throw err;
  }
}
