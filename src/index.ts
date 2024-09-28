import './scss/styles.scss';
import {EventEmitter} from './components/base/events';
import {LarekModel} from './components/LarekModel'

const events = new EventEmitter();
const larekModel = new LarekModel(events);