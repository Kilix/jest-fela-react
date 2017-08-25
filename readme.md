# jest-fela-react

Jest snapshots are amazing, but with fela, you'll get pretty ugly snapshots with classNames that don't have any meaning. However, by adding `jest-fela-react` to Jest, you can get snapshots diffs where you can understand the changed content.

## Before
If you use [`fela`](https://fela.js.org) as your CSS-in-JS solution, and you use
[snapshot testing][snapshot] with [jest][jest] then you probably have some test
snapshots that look like:

```html
<div
  className="fovk07z"
>
  <div
    className="f16lnj6g"
  >
    Hello World
  </div>
</div>
```

## After

```html
.fovk07z> div {
  font-weight: 500;
}

.fovk07z {
  border: solid 1px black;
}

.f16lnj6g {
  color: red;
  font-size: 16px;
}

<div
  className="fovk07z"
>
  <div
    className="f16lnj6g"
  >
    Hello World
  </div>
</div>
```

[Kent C. Dodds](https://github.com/kentcdodds/) published [`jest-glamor-react`](https://github.com/kentcdodds/jest-glamor-react), which does the same thing as `jest-fela-react`, but for `glamor`. He himself took inspiration from [Michele Bertoli](https://github.com/MicheleBertoli) who worked on [`jest-styled-components`](https://github.com/styled-components/jest-styled-components), an equivalent for `styled-component`. Most of the code in this repo is actually taken from these two projects, since there is little difference between snapshotting for fela and for these other css in js solution. And because they are much better than I am, so they did a better job than I would have! All I did was make it compatible with fela.

<img
  src="https://github.com/Kilix/jest-fela-react/tree/master/example.png"
  alt="Updated diff"
  title="Updated diff"
  width="500px"
/>


## Installation

```
yarn -D jest-glamor-react
```

## Usage

At the top of your test file:

```javascript
import createSerializer from 'jest-fela-react'
import {createRenderer} from 'fela';
import monolithic from 'fela-monolithic';

const felaRenderer = createRenderer({
    enhancers: [monolithic()]
})

expect.addSnapshotSerializer(createSerializer(felaRenderer))

// You're free to write your tests as you wish
```

Using [`fela-monolithic`](https://github.com/rofrischmann/fela/tree/master/packages/fela-monolithic) is not necessary, however, if you skip this part, you'll end up with one class for each property, which I think is less optimal when simply looking for differences between styles.

## LICENSE

MIT
