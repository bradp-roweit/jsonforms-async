/*
  The MIT License
  
  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
import Ajv, {ErrorObject, ValidateFunction} from 'ajv';
import addFormats from 'ajv-formats';
import type { Options } from 'ajv';
import {JsonFormsCore} from "../reducers";

export const createAjv = (options?: Options) => {
  const ajv = new Ajv({
    allErrors: true,
    verbose: true,
    strict: false,
    ...options,
  });
  addFormats(ajv);
  return ajv;
};

/**
 * Initialises async validation using the provided validator, returning
 * a promise which resolves to an array of `ErrorObject`.
 */
export const validateAsync = (
    validator: ValidateFunction | undefined,
    data: any
): Promise<ErrorObject[]> => {
  if (validator === undefined) {
    return Promise.resolve([]);
  }

  return Promise.resolve(validator(data))
      .then(() => {
        return [];
      }).catch((err) => {
        return err.errors;
      });
};

/**
 * Determines whether something has changed which requires the data to be revalidated
 */
export const shouldValidate = (oldState: JsonFormsCore, newState: JsonFormsCore): boolean => {
  return oldState.data != newState.data ||
  oldState.schema != newState.schema ||
  oldState.validationMode != newState.validationMode ||
  oldState.ajv != newState.ajv;
}
