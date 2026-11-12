import { Routes } from '@angular/router';

export const routes: Routes = [
    {path: 'dashboard',
        loadComponent : () => import('./shared/components/file-upload/file-upload').then(m => m.FileUpload),
        children: [
            {
                path: 'messages',
                loadComponent: () => import('./features/components/message-layout/message-layout').then(m => m.MessageLayout)
            }
        ]
    },
    {path: '**', redirectTo: 'dashboard'}
];
