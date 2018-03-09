# tslint-mobx
Lint rules for projects that use MobX.

### Usage
First install:

`npm install --save-dev tslint-mobx`

Then to use the default rules you can add `tslint-mobx` to `extends` in your `tslint.json`:
```js
{
  "extends": ["tslint-mobx"]
}
```
### Rules
- `mobx-react-no-unused-inject`
  - Makes sure you don't have any unused injected store.
  - For example if you have `@inject('someStore')` decorator wrapping your component, but `this.props.someStore` is unused. 
- `mobx-react-no-empty-inject`
  - Makes sure you don't have any empty injects (`@inject()`).
