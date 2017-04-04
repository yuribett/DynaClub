 
  export class Messages {

    get(key: any): string {
      return this.messages[key];
    }

    getModelMessage(modelKey: any, key: any){
      if (this.messages[modelKey] && this.messages[modelKey][key]){
        return this.messages[modelKey][key];
      }
      return this.get(key);
    }

    getModelAttrMessage(modelKey: any, attrKey: any, key: any){
      if (this.messages[modelKey] && 
          this.messages[modelKey][attrKey] && 
          this.messages[modelKey][attrKey][key]){
        return this.messages[modelKey][attrKey][key];
      } 
      const modelMsg = this.getModelMessage(modelKey, key);
      if (modelMsg){
        return modelMsg;
      }
      return this.get(key);
    }

    messages = 
    {
      'required':      'campo obrigatório',
      'team': {
        'name': {
          'minlength':     'deve ter no mínimo 3 caracteres',
          'nameNotUnique': 'nome já foi utilizado'
        }
      },
      'sprint': {
        'sprintIntersected': 'data não pode estar contida em outro período',
        'dateFinish': {
          'gt': 'data fim deve ser maior que data início'
        },
        'initialAmount': {
          'gt': 'crédito inicial deve ser maior que 0 (zero)'
        }
      }
    }

  };