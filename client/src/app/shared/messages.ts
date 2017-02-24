 
  export class Messages {

    get(key: any): string {
      return this.messages[key];
    }

    messages = 
    {
      'required':      'campo obrigatório',
      'minlength':     'deve ter no mínimo 3 caracteres',
      'nameNotUnique': 'nome já foi utilizado',
      'sprintIntersected': 'data não pode estar contida em outro período',
      'initialAmountPositive': 'crédito inicial deve ser maior que zero'
    }

  };