import ENDPOINTS from "@/api/endpoints";
import http from "@/api/http";
import { AgentCandidate, AgentRequest, DialogProps } from "@/types/types";
import CommonUtils from "@/utils/common.utils";
import {
  addToast,
  Autocomplete,
  AutocompleteItem,
  Avatar,
  Button,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
} from "@heroui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface Props extends DialogProps {
  data: AgentRequest;
}

const AssignAgentDialog = ({ isOpen, onClose, data, refetch }: Props) => {
  const [nameQuery, setNameQuery] = useState("");
  const [cityQuery, setCityQuery] = useState("");
  const [cityId, setCityId] = useState("");
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [assigning, setAssigning] = useState(false);

  const queryClient = useQueryClient();

  const { data: cityOptions = [] } = useQuery({
    queryKey: ["assign-agent-city-search", cityQuery],
    queryFn: async () => {
      const res: any = await http.get(ENDPOINTS.CONFIGS.SEARCH_CITIES, {
        params: { name: cityQuery },
      });
      return (res || []) as { id: number; name: string; stateName?: string }[];
    },
    enabled: cityQuery.trim().length >= 2,
  });

  const { data: agents = [], isLoading } = useQuery({
    queryKey: ["assign-agent-search", nameQuery, cityId],
    queryFn: async () => {
      const res: any = await http.get(ENDPOINTS.AGENT_REQUESTS.SEARCH_AGENTS, {
        params: {
          limit: 20,
          ...(nameQuery.trim() && { name: nameQuery.trim() }),
          ...(cityId && { cityId }),
        },
      });
      return (res?.data || []) as AgentCandidate[];
    },
  });

  const handleAssign = async () => {
    if (!selectedAgentId) return;

    try {
      setAssigning(true);
      await http.put(ENDPOINTS.AGENT_REQUESTS.ASSIGN(data._id), {
        agentId: selectedAgentId,
      });
      addToast({
        title: "Assigned",
        color: "success",
        description: "Agent assigned to the customer",
      });
      refetch?.();
      queryClient.invalidateQueries({ queryKey: ["agent-requests"] });
      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setAssigning(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" backdrop="blur" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <span>Assign Agent to {data?.userId?.fullName}</span>
          <div className="flex gap-2">
            {data?.pincode && (
              <Chip size="sm" variant="flat">
                Preferred pincode: {data.pincode}
              </Chip>
            )}
            {data?.preferredAgentGender && (
              <Chip size="sm" variant="flat" className="capitalize">
                Preferred gender: {data.preferredAgentGender}
              </Chip>
            )}
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="grid sm:grid-cols-2 gap-3">
            <Input
              label="Search by name"
              labelPlacement="outside"
              placeholder="Agent name"
              value={nameQuery}
              onChange={(e) => setNameQuery(e.target.value)}
            />
            <Autocomplete
              label="Filter by city"
              labelPlacement="outside"
              placeholder="Search city"
              inputValue={cityQuery}
              onInputChange={setCityQuery}
              selectedKey={cityId}
              onSelectionChange={(key) => setCityId((key as string) ?? "")}
            >
              {cityOptions.map((city) => (
                <AutocompleteItem key={String(city.id)} textValue={city.name}>
                  {city.name}
                  {city.stateName ? `, ${city.stateName}` : ""}
                </AutocompleteItem>
              ))}
            </Autocomplete>
          </div>

          <RadioGroup
            className="mt-4"
            value={selectedAgentId}
            onValueChange={setSelectedAgentId}
            isDisabled={isLoading}
          >
            {agents.map((agent) => (
              <Radio key={agent._id} value={agent._id} className="w-full max-w-full">
                <div className="flex items-center gap-2">
                  <Avatar
                    size="sm"
                    name={agent.fullName}
                    src={agent.profilePhoto?.url}
                  />
                  <div>
                    <p className="text-sm font-medium">{agent.fullName}</p>
                    <p className="text-xs text-default-500">
                      {agent.mobile} ·{" "}
                      {CommonUtils.formatLocation({
                        city: agent.address?.cityName || "",
                        state: agent.address?.stateName || "",
                        country: "",
                      }) || "No location"}
                    </p>
                  </div>
                </div>
              </Radio>
            ))}
            {!isLoading && agents.length === 0 && (
              <p className="text-sm text-default-500 py-4">
                No agents found. Adjust your search.
              </p>
            )}
          </RadioGroup>
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onPress={onClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            isDisabled={!selectedAgentId}
            isLoading={assigning}
            onPress={handleAssign}
          >
            Assign Agent
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AssignAgentDialog;
