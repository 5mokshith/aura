'use client';

import { Check, Mail, FolderOpen, FileText, BarChart3, Calendar } from 'lucide-react';

interface Scope {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
}

const scopes: Scope[] = [
  {
    id: 'gmail',
    name: 'Gmail',
    description: 'Send and read emails',
    icon: <Mail className="w-5 h-5" />,
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
  },
  {
    id: 'drive',
    name: 'Drive',
    description: 'Access and manage files',
    icon: <FolderOpen className="w-5 h-5" />,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
  },
  {
    id: 'docs',
    name: 'Docs',
    description: 'Create and edit documents',
    icon: <FileText className="w-5 h-5" />,
    color: 'text-blue-500',
    bgColor: 'bg-blue-600/10',
    borderColor: 'border-blue-600/20',
  },
  {
    id: 'sheets',
    name: 'Sheets',
    description: 'Read and write spreadsheets',
    icon: <BarChart3 className="w-5 h-5" />,
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
  },
  {
    id: 'calendar',
    name: 'Calendar',
    description: 'Manage events',
    icon: <Calendar className="w-5 h-5" />,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
  },
];

export function ScopesList() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2 px-1">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Requested Permissions</h3>
        <span className="text-xs text-neon-cyan/80 bg-neon-cyan/10 px-2 py-0.5 rounded-full border border-neon-cyan/20">5 Services</span>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {scopes.map((scope) => (
          <div
            key={scope.id}
            className="group flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-300 hover:translate-x-1"
          >
            {/* Service Icon */}
            <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${scope.bgColor} ${scope.borderColor} border flex items-center justify-center transition-transform group-hover:scale-110 duration-300`}>
              <div className={scope.color}>
                {scope.icon}
              </div>
            </div>

            {/* Service Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white group-hover:text-neon-cyan transition-colors">{scope.name}</span>
                {/* Checkmark */}
                <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Check className="w-3 h-3 text-green-400" />
                </div>
              </div>
              <p className="text-xs text-gray-400 truncate group-hover:text-gray-300 transition-colors">{scope.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 px-2 py-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
        <p className="text-xs text-blue-200/70 text-center leading-relaxed">
          These permissions allow AURA to seamlessly integrate with your workspace workflow.
        </p>
      </div>
    </div>
  );
}