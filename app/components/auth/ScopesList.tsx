'use client';

import { Check, Mail, FolderOpen, FileText, BarChart3, Calendar } from 'lucide-react';

interface Scope {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const scopes: Scope[] = [
  {
    id: 'gmail',
    name: 'Gmail',
    description: 'Send and read emails',
    icon: <Mail className="w-5 h-5" />,
    color: 'text-red-400',
  },
  {
    id: 'drive',
    name: 'Drive',
    description: 'Access and manage files',
    icon: <FolderOpen className="w-5 h-5" />,
    color: 'text-blue-400',
  },
  {
    id: 'docs',
    name: 'Docs',
    description: 'Create and edit documents',
    icon: <FileText className="w-5 h-5" />,
    color: 'text-blue-500',
  },
  {
    id: 'sheets',
    name: 'Sheets',
    description: 'Read and write spreadsheets',
    icon: <BarChart3 className="w-5 h-5" />,
    color: 'text-green-400',
  },
  {
    id: 'calendar',
    name: 'Calendar',
    description: 'Manage events',
    icon: <Calendar className="w-5 h-5" />,
    color: 'text-purple-400',
  },
];

export function ScopesList() {
  return (
    <div className="glass-panel-sm p-4 rounded-lg">
      <h3 className="text-sm font-medium text-gray-300 mb-4">Requested Permissions:</h3>
      
      <div className="space-y-3">
        {scopes.map((scope) => (
          <div key={scope.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-white/5 transition-colors">
            {/* Checkmark */}
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
              <Check className="w-3 h-3 text-green-400" />
            </div>
            
            {/* Service Icon */}
            <div className={`flex-shrink-0 ${scope.color}`}>
              {scope.icon}
            </div>
            
            {/* Service Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white">{scope.name}</span>
                <span className="text-xs text-gray-400">-</span>
                <span className="text-xs text-gray-400">{scope.description}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-3 border-t border-white/10">
        <p className="text-xs text-gray-500 text-center">
          All permissions are required for full AURA functionality
        </p>
      </div>
    </div>
  );
}