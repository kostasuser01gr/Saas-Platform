import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Filter, Search, Mail, Phone, MoreHorizontal, FileText } from 'lucide-react';

const customers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1 234 567 890', license: 'DL-982371', status: 'Active', rentals: 12, spent: '$4,500' },
  { id: 2, name: 'Alice Smith', email: 'alice@example.com', phone: '+1 987 654 321', license: 'DL-123456', status: 'Active', rentals: 5, spent: '$1,200' },
  { id: 3, name: 'Robert Johnson', email: 'rob@example.com', phone: '+1 555 019 283', license: 'DL-555123', status: 'Blacklisted', rentals: 2, spent: '$350' },
  { id: 4, name: 'Emily Davis', email: 'emily@example.com', phone: '+1 444 999 888', license: 'DL-777888', status: 'Active', rentals: 8, spent: '$2,800' },
];

export default function Customers() {
  return (
    <div className="space-y-6 p-6 overflow-y-auto h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Customer Management</h1>
          <p className="text-zinc-500 text-sm">View and manage customer profiles, documents, and history.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Filter size={16} />
            Filter
          </Button>
          <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700">
            <Plus size={16} />
            Add Customer
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        {/* Table Header / Toolbar */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
            <input 
              type="text" 
              placeholder="Search customers..." 
              className="w-full pl-10 pr-4 py-2 bg-zinc-100 dark:bg-zinc-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Contact</th>
                <th className="px-6 py-3">License Info</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">History</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm font-bold">
                        {customer.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="font-medium">{customer.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 text-xs">
                        <Mail size={12} /> {customer.email}
                      </div>
                      <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 text-xs">
                        <Phone size={12} /> {customer.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FileText size={14} className="text-zinc-400" />
                      <span className="font-mono text-xs">{customer.license}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      customer.status === 'Active' 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs">
                      <span className="font-medium">{customer.rentals}</span> rentals
                      <span className="mx-1">•</span>
                      <span className="text-zinc-500">{customer.spent}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
