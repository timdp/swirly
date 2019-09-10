# Swirly

A marble diagram generator. Produces both vector and raster images.

## Example

Here's Swirly rendering the effect of the `concatAll` operator:

![concatAll](examples/concatAll.png)

This example uses [this marble diagram](examples/concatAll.txt) as its input.

## Installation

```bash
npm install -g swirly
```

## Usage

Generate an SVG image:

```bash
swirly input.txt output.svg
```

Generate a PNG image zoomed to 200%:

```bash
swirly --scale=200 input.txt output.png
```

Input files use an extension of the syntax used for
[RxJS marble testing](https://github.com/ReactiveX/rxjs/blob/fc3d4264395d88887cae1df2de1b931964f3e684/docs_app/content/guide/testing/marble-testing.md).
You can find [a few examples](examples/) in this repository.

## Author

[Tim De Pauw](https://tmdpw.eu/)

## License

MIT
