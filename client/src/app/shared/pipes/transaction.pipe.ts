import { Pipe, PipeTransform } from '@angular/core';
import { Transaction } from '../../dashboard/transaction/transaction';
import { UserService } from '../services/user.service';

@Pipe({
  name: 'transaction'
})
export class TransactionPipe implements PipeTransform {

  constructor(private userService: UserService){}

  transform(transactions: Transaction[], type: number): Transaction[] {
    const userID = this.userService.getStoredUser()._id;
    let filteredList = transactions;

    if(type === 1){
      filteredList = transactions.filter( transaction => transaction.to._id.includes(userID));
    } else if (type === 2) {
      filteredList = transactions.filter( transaction => transaction.from._id.includes(userID));
    }

    return filteredList;
  }

}
