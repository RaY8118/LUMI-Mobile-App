// constants/Icon.js
import React from 'react';
import { FontAwesome5, Fontisto, MaterialIcons, Ionicons, AntDesign, Entypo, MaterialCommunityIcons, FontAwesome6 } from '@expo/vector-icons';

// Map of icon libraries
const IconLibraries = {
    FontAwesome5,
    FontAwesome6,
    Fontisto,
    MaterialIcons,
    Ionicons,
    AntDesign,
    Entypo,
    MaterialCommunityIcons
};

export const Icon = ({ library, name, size = 24, color = 'black', style, onPress }) => {
    const IconComponent = IconLibraries[library];

    if (!IconComponent) {
        console.error(`Icon library "${library}" not found.`);
        return null;
    }

    return <IconComponent name={name} size={size} color={color} style={style} onPress={onPress} />;
};


