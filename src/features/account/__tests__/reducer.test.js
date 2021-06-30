import reducer, { actionTypes } from '../reducer';

const initialState = {};

describe('account reducer', () => {
  it('sets input field for inexistant value', () => {
    expect(
      reducer(initialState, {
        type: actionTypes.SET_VALUE,
        payload: {
          field: 'firstName',
          value: 'John',
        },
      }),
    ).toEqual({ values: { firstName: 'John' } });
  });
  it('updates input field for existant value', () => {
    expect(
      reducer({ values: { firstName: 'John', lastName: 'Doe' } }, {
        type: actionTypes.SET_VALUE,
        payload: {
          field: 'firstName',
          value: 'Jane',
        },
      }),
    ).toEqual({ values: { firstName: 'Jane', lastName: 'Doe' } });
  });
  it('sets error for inexistant input field', () => {
    expect(
      reducer(initialState, {
        type: actionTypes.SET_ERROR,
        payload: {
          field: 'email',
          value: 'The email is incorrect',
        },
      }),
    ).toEqual({ errors: { email: 'The email is incorrect' } });
  });
  it('updates error for existant input field', () => {
    expect(
      reducer({ errors: { email: 'The email is incorrect', password: null } }, {
        type: actionTypes.SET_ERROR,
        payload: {
          field: 'email',
          value: null,
        },
      }),
    ).toEqual({ errors: { email: null, password: null } });
  });
  it('clears input field error', () => {
    expect(
      reducer({ errors: { email: 'The email is incorrect' } }, {
        type: actionTypes.CLEAR_ERROR,
        payload: 'email',
      }),
    ).toEqual({ errors: { email: null } });
  });
  it('starts loading', () => {
    expect(
      reducer({ isLoading: false }, { type: actionTypes.START_LOADING }),
    ).toEqual({ isLoading: true });
    expect(
      reducer({ isLoading: true }, { type: actionTypes.START_LOADING }),
    ).toEqual({ isLoading: true });
  });
  it('ends loading', () => {
    expect(
      reducer({ isLoading: true }, { type: actionTypes.END_LOADING }),
    ).toEqual({ isLoading: false });
    expect(
      reducer({ isLoading: false }, { type: actionTypes.END_LOADING }),
    ).toEqual({ isLoading: false });
  });
  it('throws error if action type is unknown', () => {
    expect(() => {
      reducer(initialState, { type: 'UNKNOWN' });
    }).toThrowError();
    expect(() => {
      reducer(initialState, { type: actionTypes.CLEAR_ERROR });
    }).not.toThrowError();
  });
});
