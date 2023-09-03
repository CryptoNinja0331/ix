import React, { useCallback, useContext } from "react";
import { Box, Button, HStack, useDisclosure, Text } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChain, faRobot } from "@fortawesome/free-solid-svg-icons";
import { useEditorColorMode } from "chains/editor/useColorMode";
import { ChainState } from "chains/editor/contexts";
import { ChainEditorAPIContext } from "chains/editor/ChainEditorAPIContext";
import { useDebounce } from "utils/hooks/useDebounce";
import { CollapsibleSection } from "chains/flow/CollapsibleSection";
import { NameField } from "chains/editor/fields/NameField";
import { DescriptionField } from "chains/editor/fields/DescriptionField";

const ChainExplanation = () => {
  return (
    <Box>
      Chains may be used by other agents and chains as tools with a{" "}
      <Text as={"span"} color={"blue.300"}>
        ChainReference
      </Text>{" "}
      component.
    </Box>
  );
};

const AgentExplanation = () => {
  const { agent } = useContext(AgentState);
  return (
    <Box>
      Agents may be summoned to chat sessions and will respond to messages. This
      agents responds to the alias{" "}
      <Text as={"span"} color={"blue.300"}>
        @{agent}
      </Text>
    </Box>
  );
};

const SaveModeChooser = () => {
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });
  const { isLight, highlight } = useEditorColorMode();
  const color = isLight
    ? { onColor: "#38A169", offColor: "gray.600" }
    : { onColor: "#38A169", offColor: "gray.600" };
  return (
    <Box>
      <HStack justifyItems={"fle"}>
        <Box>
          <Button
            size="sm"
            onClick={onToggle}
            bg={isOpen ? highlight.agent : color.offColor}
          >
            <FontAwesomeIcon icon={faRobot} />
            <Text as={"span"} ml={1}>
              Agent
            </Text>
          </Button>
        </Box>
        <Box>
          <Button
            size="sm"
            onClick={onToggle}
            bg={isOpen ? color.offColor : highlight.chain}
          >
            <FontAwesomeIcon icon={faChain} />{" "}
            <Text as={"span"} ml={1}>
              Chain
            </Text>
          </Button>
        </Box>
      </HStack>
      <Box
        border={"1px solid"}
        borderColor={"gray.600"}
        fontSize={"xs"}
        color={"gray.300"}
        bg={"blackAlpha.300"}
        p={2}
        m={5}
      >
        {isOpen ? <AgentExplanation /> : <ChainExplanation />}
      </Box>
    </Box>
  );
};

export const ChainEditorPane = () => {
  const { chain, setChain } = useContext(ChainState);
  const { updateChain } = useContext(ChainEditorAPIContext);

  const { callback: debouncedChainUpdate } = useDebounce((...args) => {
    updateChain(...args);
  }, 500);

  // save to API and state
  const onChange = useCallback(
    (data) => {
      debouncedChainUpdate(data);
      setChain(data);
    },
    [setChain, updateChain]
  );

  return (
    <CollapsibleSection title="General" mt={3} initialShow={true}>
      <NameField object={chain} onChange={onChange} />
      <DescriptionField object={chain} onChange={onChange} />
    </CollapsibleSection>
  );
};