import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { UserService } from './user.service';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [UserComponent],
  declarations: [UserComponent],
  providers: [UserService]
})
export class UserModule { }
