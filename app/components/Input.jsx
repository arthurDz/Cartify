import React, {forwardRef} from 'react';
import {TextInput, View, Text, StyleSheet} from 'react-native';
import { COLORS } from '../utils/Theme';

/**
 * Props:
 *  - label?: string
 *  - error?: string
 *  - rest: TextInput props (value, onChangeText, placeholder, secureTextEntry…)
 */
const Input = forwardRef(({label, error, style, ...rest}, ref) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        ref={ref}
        style={[styles.input, error && styles.errorBorder, style]}
        placeholderTextColor={COLORS['Neutrals/neutrals-6']}
        {...rest}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
});

export default Input;

const styles = StyleSheet.create({
  container: {marginBottom: 16},
  label: {marginBottom: 4, fontSize: 14, color: COLORS['Neutrals/neutrals-6']},
  input: {
    height: 48,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS['Neutrals/neutrals-6'],
    borderRadius: 8,
    fontSize: 16,
    color: COLORS['Neutrals/neutrals-6'],
  },
  errorBorder: {borderColor: COLORS['primary-rose-600']},
  error: {marginTop: 4, fontSize: 12, color: COLORS['primary-rose-600']},
});
