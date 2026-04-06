import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Input from '../common/Input';
import Button from '../common/Button';

interface ProfileEditFormProps {
  initialName?: string;
  initialEmail?: string;
  onSubmit: (data: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => void;
}

export default function ProfileEditForm({
  initialName = '',
  initialEmail = '',
  onSubmit,
}: ProfileEditFormProps) {
  const [fullName, setFullName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.fields}>
        <Input
          label="Full Name"
          placeholder="Enter your full name"
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
        />
        <Input
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input
          label="Password"
          placeholder="Create a password"
          value={password}
          onChangeText={setPassword}
          isPassword
        />
        <Input
          label="Confirm Password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          isPassword
        />
      </View>
      <Button
        label="Update Details"
        onPress={() => onSubmit({ fullName, email, password, confirmPassword })}
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
});
