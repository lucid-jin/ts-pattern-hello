import {match, P} from "ts-pattern";
import {ReactNode} from "react";

type InputValue =
  | string
  | number
  | boolean
  | { someKey: string }
  | string[]
  | [number, number];


const basicMatch = (value: InputValue): ReactNode =>
  match(value).with(20, (value) => (
    <p>
      value is <b>{value}</b>!
    </p>
  ))
    .with("Hola", (value) => (
      <p>
        value is <b>"{value}"</b>!
      </p>
    ))
    .with(true, (selections, value) => (
      <p>
        value is <b>selections:{selections}, value: {value}</b>!
      </p>
    ))
    /**
     * The `P` module provides wildcard patterns
     * to match on every value of a given type
     */
    .with(P.string, (value) => (
      <p>
        value is <b>a string</b>: {value}
      </p>
    ))
    .with(P.number, (value) => (
      <p>
        value is <b>a number</b>: {value}
      </p>
    ))
    .with(P.boolean, (value) => (
      <p>
        value is <b>a boolean</b>: {value}
      </p>
    ))
    /**
     * Patterns can be objects.
     * In order to match, the input must be an object, and all
     * properties defined on the pattern must match as well.
     *
     * in this case, the input must be an object with a `someKey`
     * property containing the "some value" string:
     */
    .with({ someKey: "some value" }, (value) => (
      <p>
        value.someKey is equal to <b>{value.someKey}</b>
      </p>
    ))
    /**
     * Patterns can be nested in any possible ways,
     * so you can use the `P.string` wildcard inside
     * an object
     */
    .with({ someKey: P.string }, (value) => (
      <p>
        value is an object. <b>value.someKey = "{value.someKey}"</b>
      </p>
    ))
    /**
     * Patterns can be arrays. They will match
     * if the input is an array of same length,
     * and if all elements it contains match.
     *
     * this will match if the value is `["hello"]`:
     */
    .with(["hello"], (value) => (
      <p>
        value is equal to <b>["{value.join()}"]</b>
      </p>
    ))
    /**
     * And this will match on any array
     * of length 2, with "hello" as first element
     * and a string as second element.
     */
    .with(["hello", P.string], (value) => (
      <p>
        Hello, <b>{value[1]}</b>!
      </p>
    ))
    /**
     * `P.array(subpattern)` matches if the input is
     * an array and if the subpattern matches every
     * item in the input array.
     *
     * This matches arrays of strings:
     */
    .with(P.array(P.string), (value) => (
      <p>
        value is an <b>array of strings</b>: {value}
      </p>
    ))
    /**
     * the `P._` pattern will match on any value.
     *
     * note that `value` inferred type is
     * [number, number], because it's the only
     * type in the `InputValue` union which matches
     * this pattern.
     */
    .with([10, P._], (value) => (
      <p>
        value is tuple and the first element is <b>{value}</b>!
      </p>
    ))
    .with([P.number, P.number], (value) => (
      <p>
        value is <b>tuple of two numbers</b>: {value}
      </p>
    ))
    .exhaustive()

export const Basic = () => {
  const inputs: InputValue[] = [
    20,
    'Hola',
    '정해지지 않는 문자열 패턴도 잡아버려',
    true,
    false,
    [1,2],
    ['A', 'B', 'C'],
    {someKey: 'hello'}
  ]

  return (
    <div>
      {
        inputs.map((value, index) => (
          <span key={index}>{basicMatch(value)}</span>
        ))
      }
    </div>
  );
};