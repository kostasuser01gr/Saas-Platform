import { Injectable } from '@nestjs/common';

export interface ImportResult {
  valid: any[];
  invalid: any[];
  duplicates: any[];
  stats: {
    total: number;
    processed: number;
    success: number;
    failed: number;
  }
}

@Injectable()
export class ImporterService {
  
  // Schemas for different import types
  private schemas = {
    service: {
      required: ['vin', 'date'],
      types: { cost: 'number', odometer: 'number' }
    },
    recalls: {
      required: ['vin', 'code'],
      types: {}
    },
    kteo: {
      required: ['vin', 'date', 'expiryDate'],
      types: {}
    },
    tyres: {
      required: ['vin', 'date', 'position'],
      types: { treadDepth: 'number' }
    }
  };

  async validateAndMap(rawData: any[], mapping: Record<string, string>, type: string): Promise<ImportResult> {
    const results: ImportResult = {
      valid: [],
      invalid: [],
      duplicates: [],
      stats: { total: rawData.length, processed: 0, success: 0, failed: 0 }
    };

    const schema = this.schemas[type] || { required: [], types: {} };
    // Mock DB for deduplication (VIN + Date usually unique for events)
    // In production, this would query the database
    const existingRecords = new Set<string>();

    for (const row of rawData) {
      const mappedRow: any = {};
      const errors: string[] = [];
      let hasMappedData = false;

      // 1. Apply Mapping
      Object.keys(mapping).forEach(header => {
        const dbField = mapping[header];
        if (dbField && dbField !== 'skip') {
          // Handle arrays (CSV row) vs Objects (JSON)
          const value = Array.isArray(row) ? row[parseInt(header)] : row[header];
          mappedRow[dbField] = value;
          hasMappedData = true;
        }
      });

      if (!hasMappedData) continue;

      // 2. Data Normalization
      if (mappedRow.vin) mappedRow.vin = String(mappedRow.vin).toUpperCase().replace(/\s/g, '');
      if (mappedRow.plate) mappedRow.plate = String(mappedRow.plate).toUpperCase().replace(/\s/g, '');

      // 3. Validation
      // Check required
      schema.required.forEach(field => {
        if (!mappedRow[field]) errors.push(`Missing required field: ${field}`);
      });

      // Check types
      Object.keys(schema.types).forEach(field => {
        if (mappedRow[field]) {
           if (schema.types[field] === 'number') {
             // Cleanup currency symbols if present
             const cleanVal = String(mappedRow[field]).replace(/[^0-9.-]+/g,"");
             const val = parseFloat(cleanVal);
             if (isNaN(val)) errors.push(`Field ${field} must be a number`);
             else mappedRow[field] = val;
           }
        }
      });

      // 4. Deduplication (Mock logic)
      // We assume VIN + Date makes a record unique for this context
      const uniqueKey = `${mappedRow.vin}-${mappedRow.date}`;
      
      if (existingRecords.has(uniqueKey)) {
        results.duplicates.push({ row: mappedRow, reason: 'Duplicate record in batch' });
        results.stats.failed++;
      } else if (errors.length > 0) {
        results.invalid.push({ row: mappedRow, errors });
        results.stats.failed++;
      } else {
        existingRecords.add(uniqueKey);
        results.valid.push(mappedRow);
        results.stats.success++;
      }
      
      results.stats.processed++;
    }

    return results;
  }

  async executeImport(validData: any[], type: string) {
    // In a real app, this would use TypeORM to save entities
    // await this.repository.save(validData);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      success: true,
      count: validData.length,
      message: `Successfully imported ${validData.length} ${type} records.`
    };
  }
}