import React from 'react';
import { View, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { AnimationPlayer } from './AnimationPlayer'; // Adjust the path as necessary

type OverlayModalProps = {
    isVisible: boolean;
    images: ImageSourcePropType[];
    frameRate: number;
    onClose: () => void;
};

const OverlayModal: React.FC<OverlayModalProps> = ({ isVisible, images, frameRate, onClose }) => {
    return (
        <Modal
            visible={isVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}>
            <TouchableOpacity
                style={styles.backdrop}
                activeOpacity={1}
                onPress={onClose}>
                <View style={styles.modalView}>
                    <AnimationPlayer images={images} frameRate={frameRate} />
                </View>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
});
