import ENDPOINTS from "@/api/endpoints";
import http from "@/api/http";
import { DialogProps } from "@/types/types";
import CommonUtils from "@/utils/common.utils";
import {
  addToast,
  Button,
  Chip,
  Divider,
  InputOtp,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { FiEye, FiLock } from "react-icons/fi";

type Phase = "locked" | "otp" | "unlocked";

const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value: string | number | boolean | undefined | null;
}) => {
  let displayValue = "-";
  if (value === true) displayValue = "Yes";
  else if (value === false) displayValue = "No";
  else if (value) displayValue = String(value);

  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-default-500 font-medium uppercase tracking-wider">
        {label}
      </span>
      <span className="text-sm font-semibold text-default-700">
        {CommonUtils.formatTitle(displayValue)}
      </span>
    </div>
  );
};

interface Props extends DialogProps {
  data: { _id: string; fullName: string };
}

const AgentProfileViewDialog = ({ isOpen, onClose, data }: Props) => {
  const [phase, setPhase] = useState<Phase>("locked");
  const [requesting, setRequesting] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [otp, setOtp] = useState("");
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [remaining, setRemaining] = useState("");
  const [profile, setProfile] = useState<any>(null);
  const [checkingGrant, setCheckingGrant] = useState(false);

  // On open, check whether an active view grant already exists on the server
  // (the OTP window is time-boxed and stored in DB). If so, restore the
  // unlocked profile + countdown instead of forcing a fresh OTP request.
  useEffect(() => {
    if (!isOpen || !data?._id) return;
    let cancelled = false;
    (async () => {
      try {
        setCheckingGrant(true);
        const full: any = await http.get(
          ENDPOINTS.AGENTS.GET_FULL_PROFILE(data._id),
          { skipErrorToast: true } as any,
        );
        if (cancelled) return;
        setProfile(full?.data ?? null);
        setExpiresAt(full?.data?.viewExpiresAt ?? null);
        setPhase("unlocked");
      } catch {
        // No active grant (403) — stay locked, agent must request OTP.
      } finally {
        if (!cancelled) setCheckingGrant(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isOpen, data?._id]);

  useEffect(() => {
    if (!expiresAt) return;
    const tick = () => {
      const diffMs = dayjs(expiresAt).diff(dayjs());
      if (diffMs <= 0) {
        setPhase("locked");
        setProfile(null);
        setExpiresAt(null);
        return false;
      }
      const mins = Math.floor(diffMs / 60000);
      const secs = Math.floor((diffMs % 60000) / 1000);
      setRemaining(`${mins}:${String(secs).padStart(2, "0")}`);
      return true;
    };
    if (!tick()) return; // already expired — don't start the interval
    const interval = setInterval(() => {
      if (!tick()) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  const handleRequestOtp = async () => {
    try {
      setRequesting(true);
      const res: any = await http.post(
        ENDPOINTS.AGENTS.REQUEST_PROFILE_VIEW(data._id),
      );
      setDevOtp(res?.data?.otp ?? null);
      setPhase("otp");
    } catch (error) {
      console.log(error);
    } finally {
      setRequesting(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return;
    try {
      setVerifying(true);
      const res: any = await http.post(
        ENDPOINTS.AGENTS.VERIFY_PROFILE_VIEW(data._id),
        { otp },
      );
      setExpiresAt(res?.data?.expiresAt ?? null);

      const full: any = await http.get(
        ENDPOINTS.AGENTS.GET_FULL_PROFILE(data._id),
      );
      setProfile(full?.data ?? null);
      setPhase("unlocked");
      addToast({
        title: "Unlocked",
        color: "success",
        description: "Full profile visible until the timer runs out",
      });
    } catch (error) {
      console.log(error);
    } finally {
      setVerifying(false);
    }
  };

  const handleClose = () => {
    setPhase("locked");
    setOtp("");
    setDevOtp(null);
    setExpiresAt(null);
    setProfile(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="2xl" backdrop="blur">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            {phase === "unlocked" ? (
              <FiEye className="text-success-600" />
            ) : (
              <FiLock className="text-default-500" />
            )}
            <span>{data?.fullName}'s Full Profile</span>
          </div>
          {phase === "unlocked" && remaining && (
            <Chip size="sm" color="warning" variant="flat" className="w-fit">
              Locks again in {remaining}
            </Chip>
          )}
        </ModalHeader>

        <ModalBody>
          {phase === "locked" &&
            (checkingGrant ? (
              <p className="text-sm text-default-500">
                Checking view permission…
              </p>
            ) : (
              <p className="text-sm text-default-500">
                Call the customer and ask for an OTP before viewing details like
                family, hobbies and lifestyle preferences.
              </p>
            ))}

          {phase === "otp" && (
            <div className="flex flex-col gap-3 items-start">
              {devOtp && (
                <Chip color="warning" variant="flat">
                  Dev fallback (SMS not wired yet) — OTP: {devOtp}
                </Chip>
              )}
              <p className="text-sm text-default-500">
                Ask {data?.fullName} for the OTP sent to their mobile.
              </p>
              <InputOtp length={6} value={otp} onValueChange={setOtp} />
            </div>
          )}

          {phase === "unlocked" && profile && (
            <div className="grid gap-6">
              <div>
                <h4 className="text-sm font-bold text-default-800 mb-2">
                  Background
                </h4>
                <Divider className="mb-3" />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <DetailItem label="Sect" value={profile?.sect} />
                  <DetailItem label="Maslak" value={profile?.maslak} />
                  <DetailItem label="Community" value={profile?.community} />
                  <DetailItem
                    label="Marital Status"
                    value={profile?.maritalStatus}
                  />
                  <DetailItem
                    label="Qualification"
                    value={profile?.qualification}
                  />
                  <DetailItem label="Work Sector" value={profile?.workSector} />
                  <DetailItem
                    label="Annual Income"
                    value={profile?.annualIncome}
                  />
                  <DetailItem
                    label="Family Living With User"
                    value={profile?.isFamilyLivingWithUser}
                  />
                </div>
              </div>

              {profile?.family && (
                <div>
                  <h4 className="text-sm font-bold text-default-800 mb-2">
                    Family
                  </h4>
                  <Divider className="mb-3" />
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <DetailItem
                      label="Father's Name"
                      value={profile.family?.fatherName}
                    />
                    <DetailItem
                      label="Father's Occupation"
                      value={profile.family?.fatherOccupation}
                    />
                    <DetailItem
                      label="Father's Contact"
                      value={profile.family?.fatherContact}
                    />
                    <DetailItem
                      label="Mother's Name"
                      value={profile.family?.motherName}
                    />
                    <DetailItem
                      label="Mother's Occupation"
                      value={profile.family?.motherOccupation}
                    />
                    <DetailItem
                      label="Mother's Contact"
                      value={profile.family?.motherContact}
                    />
                    <DetailItem
                      label="About Family"
                      value={profile.family?.aboutFamily}
                    />
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-sm font-bold text-default-800 mb-2">
                  Lifestyle & Hobbies
                </h4>
                <Divider className="mb-3" />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <DetailItem
                    label="Diet Preference"
                    value={profile?.dietPreference}
                  />
                  <DetailItem label="Smoke" value={profile?.smoke} />
                  <DetailItem label="Drink" value={profile?.drink} />
                  <DetailItem
                    label="Hobbies"
                    value={profile?.hobbies?.join(", ")}
                  />
                  <DetailItem
                    label="Sports"
                    value={profile?.sports?.join(", ")}
                  />
                  <DetailItem
                    label="Music"
                    value={profile?.musics?.join(", ")}
                  />
                </div>
              </div>
            </div>
          )}
        </ModalBody>

        <ModalFooter>
          <Button variant="flat" onPress={handleClose}>
            Close
          </Button>
          {phase === "locked" && !checkingGrant && (
            <Button
              color="primary"
              isLoading={requesting}
              onPress={handleRequestOtp}
            >
              Request OTP
            </Button>
          )}
          {phase === "otp" && (
            <Button
              color="primary"
              isLoading={verifying}
              isDisabled={!otp}
              onPress={handleVerifyOtp}
            >
              Verify OTP
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AgentProfileViewDialog;
