// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getZodOutput } from 'src/app/utils/zod';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
    selector: 'app-file-explorer',
    templateUrl: './file-explorer.component.html',
    styleUrls: ['./file-explorer.component.scss'],
})
export class FileExplorerComponent implements OnInit {
    ngOnInit(): void {
        throw new Error('Method not implemented.');
    }
}
