import React, { useEffect, useState } from 'react';
import { LayoutChangeEvent, StyleProp, StyleSheet, Text, TextStyle, View } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface MarqueeTextProps {
  text: string;
  style?: StyleProp<TextStyle>;
  speed?: number; // Pixels per second
  delay?: number; // Delay before starting animation in ms
}

const MarqueeText: React.FC<MarqueeTextProps> = ({
  text,
  style,
  speed = 40,
  delay = 2000,
}) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const [textWidth, setTextWidth] = useState(0);
  const translateX = useSharedValue(0);

  const onContainerLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  const onTextLayout = (event: LayoutChangeEvent) => {
    setTextWidth(event.nativeEvent.layout.width);
  };

  useEffect(() => {
    cancelAnimation(translateX);
    translateX.value = 0;

    if (textWidth > containerWidth && containerWidth > 0) {
      const distance = textWidth + 40; // text width + gap
      const duration = (distance / speed) * 1000;

      translateX.value = withDelay(
        delay,
        withRepeat(
          withTiming(-distance, {
            duration,
            easing: Easing.linear,
          }),
          -1, // Infinite
          false // Do not reverse
        )
      );
    }
  }, [textWidth, containerWidth, text, speed, delay]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const shouldScroll = textWidth > containerWidth;

  return (
    <View
      style={styles.container}
      onLayout={onContainerLayout}
    >
      <View style={{ position: 'absolute', opacity: 0 }}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={style} onLayout={onTextLayout}>
            {text}
          </Text>
        </View>
      </View>

      {shouldScroll ? (
        <Animated.View style={[styles.animatedContent, animatedStyle]}>
          <Text style={[style, { marginRight: 40 }]}>
            {text}
          </Text>
          <Text style={style}>
            {text}
          </Text>
        </Animated.View>
      ) : (
        <Text style={style} numberOfLines={1}>
          {text}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    width: '100%',
  },
  animatedContent: {
    flexDirection: 'row',
  },
});

export default MarqueeText;
