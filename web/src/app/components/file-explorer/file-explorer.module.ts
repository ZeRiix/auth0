import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileExplorerComponent } from './file-explorer.component';
import { ContainerModule } from '../container/container.module';

@NgModule({
    declarations: [FileExplorerComponent],
    imports: [CommonModule, ContainerModule],
    exports: [FileExplorerComponent],
})
export class FileExplorerModule {}
