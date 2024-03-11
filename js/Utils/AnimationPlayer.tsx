import React, { useState, useEffect, useRef } from 'react';
import { View, Image, Button, ImageSourcePropType } from 'react-native';

type AnimationPlayerProps = {
    images: ImageSourcePropType[];
    frameRate: number;
};

const AnimationPlayer: React.FC<AnimationPlayerProps> = ({ images, frameRate }) => {
    const [index, setIndex] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(true);
    const intervalRef = useRef<NodeJS.Timeout>();

    // Calculate frame duration from frame rate
    const frameDuration = 1000 / frameRate;

    useEffect(() => {
        if (isPlaying) {
            intervalRef.current = setInterval(() => {
                setIndex((prevIndex) => (prevIndex + 1) % images.length);
            }, frameDuration);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isPlaying, frameDuration, images.length]);

    const play = () => setIsPlaying(true);
    const pause = () => setIsPlaying(false);

    return (
        <View>
            <Image source={images[index]} style={{ width: 250, height: 250 }} />
        </View>
    );
};

export default AnimationPlayer;