import { Box, Button, Container, Heading, Stack, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
    const navigate = useNavigate();
    return (
        <>
            <Container maxW={'3xl'}>
                <Stack
                    as={Box}
                    textAlign={'center'}
                    spacing={{ base: 8, md: 14 }}
                    py={{ base: 20, md: 36 }}>
                    <Heading
                        fontWeight={600}
                        fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
                        lineHeight={'110%'}>
                        ReelChat:<br />
                        <Text as={'span'} color={'green.400'}>
                            Where Every Connection's a Catch!
                        </Text>
                    </Heading>
                    <Text color={'white.500'}>
                        Dive into ReelChat, where serendipity meets conversation!
                        Join the thrill of spontaneous video chats with fascinating strangers.
                        Who knows what hook-ups and meaningful exchanges you'll reel in next?
                        Cast your line and let the conversations begin!
                    </Text>
                    <Stack
                        direction={'column'}
                        spacing={3}
                        align={'center'}
                        alignSelf={'center'}
                        position={'relative'}>
                        <Button
                            onClick={() => navigate("/chat")}
                            colorScheme={'green'}
                            bg={'green.400'}
                            rounded={'full'}
                            px={6}
                            _hover={{
                                bg: 'green.500',
                            }}>
                            Start
                        </Button>
                    </Stack>
                </Stack>
            </Container>
        </>
    );
};

export default Home;