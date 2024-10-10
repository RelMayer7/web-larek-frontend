import {Component} from '../base/component';
import {IEvents} from '../base/events';
import {ensureElement} from '../../utils/utils';
import {IContactInfo, IPaymentInfo} from '../../types/index';

interface IForm {
  valid: boolean;
  errors: string[];
}

export class Form<T> extends Component<IForm> {
  protected _submitButton: HTMLButtonElement;
  protected _errors: HTMLElement;

  constructor(protected container: HTMLFormElement, protected events: IEvents) {
    super(container);

    this._submitButton = ensureElement<HTMLButtonElement>('button[type=submit]', container);
    this._errors = ensureElement<HTMLElement>('.form__errors', container);

    this.container.addEventListener('input', (e: Event) => {
      const target = e.target as HTMLInputElement;
      const field = target.name as keyof T;
      const value = target.value;
      this.onInputChange(field, value);
    });

    this.container.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      this.events.emit(`${this.container.name}:submit`);
    })
  }

  protected onInputChange(field: keyof T, value: string) {
    this.events.emit(`${this.container.name}.${String(field)}:change`, {
      field,
      value,
    })
  }

  set valid(value: boolean) {
    this.setDisabled(this._submitButton, !value);
  }

  set errors(value: string) {
    this.setText(this._errors, value);
  }

  render(state: Partial<T> & IForm) {
    const {valid, errors, ...inputs} = state;
    super.render({valid, errors});
    Object.assign(this, inputs);
    return this.container;
  }
}

export class OrderForm extends Form<IPaymentInfo> {
  protected buttonCard: HTMLButtonElement;
  protected buttonCash: HTMLButtonElement;
  protected buttons: HTMLButtonElement[];

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
    this.buttonCard = container.card;
    this.buttonCash = container.cash;
    this.buttons = [this.buttonCard, this.buttonCash];

    this.buttons.forEach(button => {
      button.addEventListener('click', () => {
        const field = 'payment' as keyof IPaymentInfo;
        const name = button.name;
        this.onInputChange(field, name);
        this.toggleButton(name);
      })
    })
  }

  set address(value: string) {
    (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
  }

  toggleButton(name: string) {
    this.buttons.forEach(button => {
      this.toggleClass(button, 'button_alt-active', button.name === name);
    })
  }

  battonDisabled() {
    this.buttons.forEach(button => {
      this.toggleClass(button, 'button_alt-active', false);
    })
  }

}

export class ContactsForm extends Form<IContactInfo> {
  
  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
  }

  set email(value: string) {
    (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
  }

  set phone(value: string) {
    (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
  }

}