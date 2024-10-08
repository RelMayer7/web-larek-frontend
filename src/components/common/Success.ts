import {Component} from '../base/component';
import {ensureElement} from '../../utils/utils';

interface ISuccess {
  total: number;
}

interface ISuccessActions {
  onClick: () => void;
}

export class Success extends Component<ISuccess> {
  protected _close: HTMLButtonElement;
  protected _total: HTMLElement;

  constructor(protected container: HTMLFormElement, actions: ISuccessActions) {
    super(container);

    this._close = ensureElement<HTMLButtonElement>('.order-success__close', container);
    this._total = ensureElement<HTMLElement>('.order-success__description', container);


    if (actions?.onClick) {
      this._close.addEventListener('click', actions.onClick);
    }
  }

  set total(value: number) {
    this.setText(this._total, `Списано ${value} синапсов`);
  }
}