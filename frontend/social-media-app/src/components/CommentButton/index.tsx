import { FaRegCommentDots } from "react-icons/fa";
import { Flex, IconButton, Input } from "@chakra-ui/react";
import {
  Avatar,
  CloseButton,
  Dialog,
  HStack,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";
import { IoSend } from "react-icons/io5";
import { FaTrash } from "react-icons/fa";
import useComment from "@/hooks/useComment";
import { useRef } from "react";
import { getPersistedUserInfo } from "@/services/persist-user-info.service";
import useCreateComment from "@/hooks/useCreateComment";
import useDeleteComment from "@/hooks/useDeleteComment";

type Props = {
  postId: number;
};

function CommentButton({ postId }: Props) {
  const cookieUser = getPersistedUserInfo();
  const inputRef = useRef<HTMLInputElement>(null);
  const commentsScrollRef = useRef<HTMLDivElement>(null);
  const { data: commentsData } = useComment(postId.toString());
  const { mutate: createComment } = useCreateComment(postId.toString());
  const { mutate: deleteComment } = useDeleteComment(postId.toString());
  return (
    <Dialog.Root>
      <HStack gap={1} align="center">
        <Dialog.Trigger asChild>
          <IconButton
            aria-label="comment"
            variant="ghost"
            colorPalette="blue"
            cursor="pointer"
          >
            <FaRegCommentDots size={20} />
          </IconButton>
        </Dialog.Trigger>
        {commentsData && commentsData.length > 0 && (
          <Text fontSize="sm">{commentsData.length}</Text>
        )}
      </HStack>
      <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content
              bg="white"
              color="black"
              maxW={{ base: "90vw", md: "700px" }}
              w="700px"
            >
              <Dialog.Header>
                <Dialog.Title>Comments</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body pb="8">
                <VStack
                  ref={commentsScrollRef}
                  align="stretch"
                  gap={4}
                  maxH="50vh"
                  overflowY="auto"
                  pr={4}
                  mr={-4}
                >
                  {!commentsData ||
                    (commentsData.length === 0 && (
                      <Text textAlign="center" color="gray.400">
                        No comments yet
                      </Text>
                    ))}
                  {commentsData?.map((comment) => (
                    <HStack
                      key={comment.id}
                      align="center"
                      gap={3}
                      marginTop={2}
                    >
                      <Avatar.Root size="sm">
                        <Avatar.Image src={comment.urlPhoto} />
                        <Avatar.Fallback name={comment.username} />
                      </Avatar.Root>
                      <VStack align="flex-start" gap={0} flex="1" minW={0}>
                        <HStack justify="space-between" width="100%">
                          <Text fontWeight="bold">{comment.username}</Text>
                          <Flex gap={2} align="center">
                            <IconButton
                              aria-label="delete comment"
                              variant="ghost"
                              colorPalette="red"
                              cursor="pointer"
                              onClick={() => {
                                deleteComment(comment);
                              }}
                            >
                              <FaTrash />
                            </IconButton>
                            <Text fontSize="xs" color="gray.400">
                              {comment.date}
                            </Text>
                          </Flex>
                        </HStack>
                        <Text
                          textAlign="left"
                          wordBreak="break-word"
                          whiteSpace="pre-wrap"
                        >
                          {comment.description}
                        </Text>
                      </VStack>
                    </HStack>
                  ))}
                </VStack>
                <VStack align="stretch" gap={4} mt="8">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (inputRef.current?.value) {
                        createComment({
                          id: 0,
                          username: cookieUser?.username || "Anonymous",
                          idPost: postId,
                          idUser: cookieUser?.id || "0",
                          urlPhoto: cookieUser?.urlPhoto || "",
                          description: inputRef.current?.value || "",
                          date: new Date().toISOString(),
                        });
                        inputRef.current.value = "";
                        commentsScrollRef.current?.scrollTo({
                          top: 0,
                          behavior: "smooth",
                        });
                      }
                    }}
                  >
                    <HStack
                      gap={2}
                      bg="gray.100"
                      borderRadius="full"
                      pl={4}
                      pr={1}
                      py={1}
                    >
                      <Input
                        ref={inputRef}
                        name="comment"
                        type="text"
                        placeholder="Write a comment..."
                        variant="flushed"
                        border="none"
                        _focus={{ boxShadow: "none" }}
                        flex="1"
                      />
                      <IconButton
                        aria-label="submit comment"
                        colorPalette="blue"
                        borderRadius="full"
                        cursor="pointer"
                        type="submit"
                      >
                        <IoSend size={18} />
                      </IconButton>
                    </HStack>
                  </form>
                </VStack>
              </Dialog.Body>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

export default CommentButton;
