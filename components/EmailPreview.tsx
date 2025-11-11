import React, { useState } from 'react';
import type { EmailData } from '../types';
import { DesktopIcon } from './icons/DesktopIcon';
import { TabletIcon } from './icons/TabletIcon';
import { MobileIcon } from './icons/MobileIcon';

interface EmailPreviewProps {
  emailData: EmailData;
}

type ViewMode = 'desktop' | 'tablet' | 'mobile';

const viewConfig = {
    desktop: { width: '100%', icon: DesktopIcon },
    tablet: { width: '768px', icon: TabletIcon },
    mobile: { width: '375px', icon: MobileIcon },
};

export const EmailPreview: React.FC<EmailPreviewProps> = ({ emailData }) => {
    const [view, setView] = useState<ViewMode>('desktop');

    const Iframe = ({ htmlContent }: { htmlContent: string }) => {
        return (
            <iframe
                srcDoc={htmlContent}
                title="Email Preview"
                sandbox="allow-scripts"
                width="100%"
                height="100%"
                frameBorder="0"
                className="transition-all duration-300 ease-in-out"
            />
        );
    };

    const ViewButton = ({ mode }: { mode: ViewMode }) => {
        const { icon: Icon } = viewConfig[mode];
        const isActive = view === mode;
        return (
            <button
                onClick={() => setView(mode)}
                title={`Switch to ${mode} view`}
                className={`p-2 rounded-md transition-colors ${
                    isActive ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
            >
                <Icon className="w-5 h-5" />
            </button>
        );
    };

    return (
        <div className="bg-gray-900 rounded-lg overflow-hidden h-full min-h-[80vh] flex flex-col">
            <div className="flex-shrink-0 bg-gray-800 p-3 border-b border-gray-700 flex justify-between items-center">
                <div className="text-sm">
                    <p><span className="font-semibold text-gray-400">Subject: </span>{emailData.subject}</p>
                    <p><span className="font-semibold text-gray-400">Preheader: </span>{emailData.preheader}</p>
                </div>
                <div className="flex items-center space-x-2 p-1 bg-gray-900 rounded-lg">
                    <ViewButton mode="desktop" />
                    <ViewButton mode="tablet" />
                    <ViewButton mode="mobile" />
                </div>
            </div>
            <div className="flex-grow p-4 flex justify-center items-start overflow-auto">
                 <div 
                    className="shadow-2xl rounded-lg overflow-hidden transition-all duration-500 ease-in-out w-full h-full"
                    style={{ maxWidth: viewConfig[view].width }}
                >
                    <Iframe htmlContent={emailData.bodyHtml} />
                </div>
            </div>
        </div>
    );
};
