import { SafeAreaView, View, StyleSheet, FlatList, Pressable } from "react-native";
import { Text, Avatar, Divider, Surface } from "react-native-paper";
import { useState } from "react";

interface ChatPreview {
    id: string;
    name: string;
    lastMessage: string;
    timestamp: string;
    unreadCount: number;
    avatarUrl?: string;
}

export default function ChatList() {
    const [chats] = useState<ChatPreview[]>([
        {
            id: '1',
            name: 'John Doe',
            lastMessage: 'Hey, how are you?',
            timestamp: '10:30 AM',
            unreadCount: 2,
        },
        {
            id: '2',
            name: 'Jane Smith',
            lastMessage: 'See you tomorrow!',
            timestamp: 'Yesterday',
            unreadCount: 0,
        },
    ]);

    const renderChatItem = ({ item }: { item: ChatPreview }) => (
        <Pressable onPress={() => console.log(`Navigate to chat ${item.id}`)}>
            <Surface style={styles.chatItem}>
                <Avatar.Text 
                    size={50} 
                    label={item.name.split(' ').map(n => n[0]).join('')} 
                    style={styles.avatar}
                />
                <View style={styles.chatInfo}>
                    <View style={styles.chatHeader}>
                        <Text variant="titleMedium">{item.name}</Text>
                        <Text variant="bodySmall" style={styles.timestamp}>
                            {item.timestamp}
                        </Text>
                    </View>
                    <View style={styles.lastMessageContainer}>
                        <Text 
                            variant="bodyMedium" 
                            numberOfLines={1} 
                            style={styles.lastMessage}
                        >
                            {item.lastMessage}
                        </Text>
                        {item.unreadCount > 0 && (
                            <View style={styles.unreadBadge}>
                                <Text style={styles.unreadCount}>
                                    {item.unreadCount}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </Surface>
            <Divider />
        </Pressable>
    );

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={chats}
                renderItem={renderChatItem}
                keyExtractor={item => item.id}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    chatItem: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'center',
    },
    avatar: {
        marginRight: 16,
    },
    chatInfo: {
        flex: 1,
    },
    chatHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    timestamp: {
        color: '#666',
    },
    lastMessageContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    lastMessage: {
        flex: 1,
        color: '#666',
    },
    unreadBadge: {
        backgroundColor: '#2196F3',
        borderRadius: 12,
        minWidth: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    unreadCount: {
        color: '#fff',
        fontSize: 12,
        paddingHorizontal: 6,
    },
});