import React, { useRef, useState } from "react";
import {
  Dimensions,
  Image,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Colors } from "../theme/colors";

interface Car360ViewerProps {
  images: string[];
  height?: number;
  width?: number;
}

const SCREEN_WIDTH = Dimensions.get("window").width;

// Pixels of horizontal drag to complete one full revolution
const DRAG_PER_REVOLUTION = 300;

export default function Car360Viewer({
  images,
  height = 260,
  width = SCREEN_WIDTH - 32,
}: Car360ViewerProps) {
  const [index, setIndex] = useState(0);
  const lastX = useRef<number | null>(null);
  const accumulatedDrag = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (_, gestureState) => {
        lastX.current = gestureState.moveX;
      },
      onPanResponderMove: (_, gestureState) => {
        if (lastX.current === null) return;
        const dx = gestureState.moveX - lastX.current;
        lastX.current = gestureState.moveX;
        accumulatedDrag.current += dx;

        const step = DRAG_PER_REVOLUTION / images.length;
        const steps = Math.round(accumulatedDrag.current / step);
        if (steps !== 0) {
          accumulatedDrag.current -= steps * step;
          setIndex((prev) => {
            // drag right → counter-clockwise (decrease index)
            // drag left  → clockwise          (increase index)
            return (prev - steps + images.length * 100) % images.length;
          });
        }
      },
      onPanResponderRelease: () => {
        lastX.current = null;
      },
    })
  ).current;

  if (!images || images.length === 0) {
    return (
      <View style={[styles.placeholder, { height, width }]}>
        <Text style={styles.placeholderText}>No images provided</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <View
        style={[styles.canvasBg, { width, height }]}
        {...panResponder.panHandlers}
      >
        {images.map((uri, i) => (
          <Image
            key={uri}
            source={{ uri }}
            style={[
              styles.frame,
              { width, height, opacity: i === index ? 1 : 0 },
            ]}
            resizeMode="contain"
          />
        ))}
      </View>
      <Text style={styles.hint}>Vuot de xoay 360°</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
  },
  placeholder: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    color: Colors.textMuted,
    fontSize: 14,
  },
  hint: {
    marginTop: 6,
    fontSize: 12,
    color: Colors.textMuted,
  },
  canvasBg: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
  },
  frame: {
    position: "absolute",
    top: 0,
    left: 0,
  },
});
