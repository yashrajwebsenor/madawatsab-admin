import ENDPOINTS from "@/api/endpoints";
import http from "@/api/http";
import { AgentRequestStatus } from "@/types/enum";
import { AgentRequest, DialogProps } from "@/types/types";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Avatar,
  addToast,
} from "@heroui/react";
import dayjs from "dayjs";
import { useState } from "react";
import {
  FiCalendar,
  FiCheckCircle,
  FiPhone,
  FiUser,
  FiXCircle,
} from "react-icons/fi";

interface Props extends DialogProps {
  status: AgentRequestStatus;
  data: AgentRequest;
}

const AgentRequestDialog = ({
  isOpen,
  onClose,
  status,
  refetch,
  data,
}: Props) => {
  const [loading, setLoading] = useState(false);

  const isAccepting = status === AgentRequestStatus.accepted;

  const handleUpdateStatus = async () => {
    try {
      setLoading(true);
      await http.put(ENDPOINTS.AGENTS.UPDATE_REQUEST(data._id), {
        status,
      });
      addToast({
        title: "Success",
        description: `Request ${isAccepting ? "accepted" : "rejected"} successfully!`,
        color: "success",
      });
      refetch?.();
      onClose();
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      backdrop="blur"
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          },
          exit: {
            y: -20,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: "easeIn",
            },
          },
        },
      }}
      classNames={{
        base: "bg-white dark:bg-zinc-900 shadow-2xl rounded-[32px]",
        header: "border-b border-default-100 py-6",
        body: "py-6",
        footer: "border-t border-default-100 py-4",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-xl ${
                    isAccepting
                      ? "bg-success-100 text-success-600"
                      : "bg-danger-100 text-danger-600"
                  }`}
                >
                  {isAccepting ? (
                    <FiCheckCircle size={24} />
                  ) : (
                    <FiXCircle size={24} />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-default-900">
                    {isAccepting ? "Approve Request" : "Reject Request"}
                  </h3>
                  <p className="text-xs font-normal text-default-500">
                    Agent Registration Request Process
                  </p>
                </div>
              </div>
            </ModalHeader>
            <ModalBody>
              {/* Profile Overview Section */}
              <div className="rounded-[24px] border border-default-100 bg-default-50 p-5">
                <div className="flex items-start gap-4">
                  <Avatar
                    isBordered
                    radius="full"
                    color={isAccepting ? "success" : "danger"}
                    src={data?.userId?.photos?.[0]?.url}
                    className="text-large h-20 w-20 flex-shrink-0"
                    fallback={<FiUser size={32} className="text-default-400" />}
                  />
                  <div className="flex min-w-0 flex-grow flex-col gap-2">
                    <div>
                      <h4 className="truncate text-lg font-bold leading-tight text-default-900">
                        {data?.userId?.fullName}
                      </h4>
                      <p className="text-primary text-xs font-medium">
                        Potential Agent
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-1">
                      <div className="flex items-center gap-2 text-sm text-default-500">
                        <FiPhone className="flex-shrink-0" size={14} />
                        <span>{data?.userId?.mobile}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-default-500">
                        <FiCalendar className="flex-shrink-0" size={14} />
                        <span>
                          Requested{" "}
                          {dayjs(data?.createdAt).format("DD MMM, YYYY")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="gap-3">
              <Button
                variant="flat"
                onPress={onClose}
                className="bg-default-100 text-default-600 hover:bg-default-200 px-6 font-bold"
              >
                Go Back
              </Button>
              <Button
                color={isAccepting ? "success" : "danger"}
                variant="shadow"
                onPress={handleUpdateStatus}
                isLoading={loading}
                startContent={isAccepting ? <FiCheckCircle /> : <FiXCircle />}
                className="px-10 font-bold shadow-md text-white"
              >
                {isAccepting ? "Confirm Approval" : "Confirm Rejection"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default AgentRequestDialog;
