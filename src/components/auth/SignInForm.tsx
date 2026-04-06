import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Input from '../common/Input';
import Button from '../common/Button';
import { Colors } from '../../constants/theme';
import { FontFamily } from '../../constants/typography';

interface SignInFormProps {
  onSubmit: (data: { email: string; password: string }) => void;
}

export default function SignInForm({ onSubmit }: SignInFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.fields}>
        <Input
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
        <Input
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          isPassword
        />
        <TouchableOpacity
          style={styles.forgotButton}
          activeOpacity={0.7}
          onPress={() => {
            // TODO: navigate to forgot password
          }}
        >
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>
      </View>

      <Button
        label="Sign In"
        onPress={() => onSubmit({ email, password })}
        variant="primary"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  fields: {
    gap: 16,
  },
  forgotButton: {
    alignSelf: 'flex-end',
  },
  forgotText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.dark.textSecondary,
  },
});
