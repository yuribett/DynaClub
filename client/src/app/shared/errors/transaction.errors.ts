import { Error, CommonErrors } from './error';

export class TransactionErrors extends CommonErrors {
    static errors: Array<Error> = [
        { ref: 'TS0001', msg: '&Eacute; obrigat&oacute;rio informar o motivo da doa&ccedil;&atilde;o' },
        { ref: 'TS0002', msg: '&Eacute; obrigat&oacute;rio informar a quantidade de Dynas que voc&ecirc; quer doar' },
        { ref: 'TS0003', msg: 'Saldo insuficiente' },
        { ref: 'TS0004', msg: 'A mensagem deve conter entre 1 e 500 caracteres' },
    ];
}