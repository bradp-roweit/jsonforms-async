import * as React from 'react';
import * as _ from 'lodash';
import {
  computeLabel,
  Control,
  ControlElement,
  ControlProps,
  ControlState,
  convertToValidClassName,
  DispatchField,
  isControl,
  isDescriptionHidden,
  mapStateToControlProps,
  RankedTester,
  rankWith,
  registerStartupRenderer,
  resolveSchema
} from '@jsonforms/core';
import { connect } from 'react-redux';

import { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';

export class MaterialInputControl extends Control<ControlProps, ControlState> {
  render() {
    const {  
      id, 
      errors, 
      label, 
      uischema, 
      schema, 
      visible, 
      required, 
      parentPath 
    } = this.props;
    const isValid = errors.length === 0;
    const trim = uischema.options && uischema.options.trim;
    const controlElement = uischema as ControlElement;
    const resolvedSchema = resolveSchema(schema, controlElement.scope.$ref);
    const description = resolvedSchema.description === undefined ? '' : resolvedSchema.description;
    let style = {};
    if (!visible) {
      style = {display: 'none'};
    }
    const classNames: string[] = !_.isEmpty(controlElement.scope) ?
        [`${convertToValidClassName(controlElement.scope.$ref)}`] : [];

    return (
      <FormControl
        className={classNames.join(' ')}
        style={style}
        fullWidth={!trim}
        onFocus={() => this.onFocus()}
        onBlur={() => this.onBlur()}
      >
        <InputLabel htmlFor={id} error={!isValid}>
          {computeLabel(label, required)}
        </InputLabel>
        <DispatchField uischema={uischema} schema={schema} path={parentPath} />
        <FormHelperText
          error={!isValid}
          hidden={isValid && isDescriptionHidden(visible, description, this.state.isFocused)}
        >
          {!isValid ? errors : description}
        </FormHelperText>
      </FormControl>
    );
  }
};
export const inputControlTester: RankedTester = rankWith(1, isControl);
export default registerStartupRenderer(
  inputControlTester,
  connect(mapStateToControlProps)(MaterialInputControl)
);