import React from 'react';
import { View, Text } from 'react-native';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.log('Error captured in ErrorBoundary:', error, info);
    // You can also send this error to a logging service here
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, color: 'red' }}>Something went wrong.</Text>
          <Text>{this.state.error?.toString()}</Text>
        </View>
      );
    }

    return this.props.children;
  }
}
