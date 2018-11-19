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
- `mobx-react-no-inject-decorators`
  - Makes sure you don't have any inject decorators (`@inject()`) at all on classes.
    
### Adding your own rules
Adding your own rules is straightforward.

Add your rule file to the `src/rules` directory, and your tests to a file with the same name, ending with `.spec`, in the `test` directory.

PRs are welcome.
