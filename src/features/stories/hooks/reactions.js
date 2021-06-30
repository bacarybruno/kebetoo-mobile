import { useCallback, useState, useEffect } from 'react';

import { api } from '@app/shared/services';

export const REACTION_TYPES = {
  COMMENT: 'comment',
  LOVE: 'love',
  SHARE: 'share',
};

export const countReactions = (story, type) => (
  story.reactions.filter((r) => r.type === type).length
);

// TODO: create a hook for stories based on this one
const useStoriesReactions = ({
  story: givenStory, author, comments,
}) => {
  const [story, setStory] = useState(givenStory);

  useEffect(() => {
    setStory({ ...givenStory });
  }, [givenStory]);

  const findUserReaction = useCallback((reaction) => reaction.author === author, [author]);

  const userReaction = story.reactions.find(findUserReaction) || {};

  const createReaction = useCallback(async (type) => {
    // create random negative id
    const optimisticId = parseInt(Math.random() * -1000000, 10);

    // display a reaction with expected value and a fake id
    const optimisticStory = {
      ...story,
      reactions: [
        ...story.reactions,
        { id: optimisticId, type, author },
      ],
    };
    setStory({ ...optimisticStory });

    // create the reaction on the backend
    api.reactions.createStoryReaction(type, story.id, author)
      .then((res) => {
        // replace the fake reaction created with the new one
        const result = res;
        result.story = result.story.id;
        result.author = result.author.id;
        optimisticStory.reactions = [
          ...optimisticStory.reactions.filter((reaction) => reaction.id !== optimisticId),
          result,
        ];
        // update story to trigger re-render
        setStory({ ...optimisticStory });
      }).catch(() => {
        // rollback the operation
        optimisticStory.reactions = optimisticStory.reactions.filter((r) => r.id !== optimisticId);
        setStory({ ...optimisticStory });
      });
  }, [author, story]);

  const deleteReaction = useCallback(async (reactionId) => {
    // don't do anything if reactionId is not a valid ID
    if (parseInt(reactionId, 10) < 0) return;

    // remove reaction from state
    const optimisticStory = { ...story };
    const deletedReaction = optimisticStory.reactions.find((r) => r.id === reactionId);
    optimisticStory.reactions = optimisticStory.reactions.filter((r) => r.id !== reactionId);
    setStory({ ...optimisticStory });

    // then remove it from the backend
    api.reactions.delete(reactionId).catch(() => {
      // operation failed => rollback the operation
      optimisticStory.reactions = [
        ...optimisticStory.reactions,
        deletedReaction,
      ];
      setStory({ ...optimisticStory });
    });
  }, [story]);

  const handleStoryReaction = useCallback(async (type) => {
    const reaction = story.reactions.find(findUserReaction);
    if (reaction === undefined) {
      await createReaction(type);
    } else if (reaction.type === type) {
      await deleteReaction(reaction.id);
    }
  }, [story.reactions, findUserReaction, createReaction, deleteReaction]);

  return {
    onReaction: handleStoryReaction,
    userReactionType: userReaction.type,
    count: {
      loves: countReactions(story, REACTION_TYPES.LOVE),
      comments: (comments || story.comments).length,
      shares: story.reposts?.length ?? 0,
    },
  };
};

export default useStoriesReactions;
