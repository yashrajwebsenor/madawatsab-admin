import ENDPOINTS from "@/api/endpoints";
import http from "@/api/http";
import MetadataDropdown from "@/components/shared/MetadataDropdown";
import { DialogProps, MatchCandidate, PartnerPreferenceRequest } from "@/types/types";
import { Gender, MaritalStatus, MetadataTypes, Sects } from "@/types/enum";
import CommonUtils from "@/utils/common.utils";
import {
  addToast,
  Avatar,
  Button,
  Checkbox,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import dayjs from "dayjs";
import { useState } from "react";

interface Props extends DialogProps {
  data: PartnerPreferenceRequest;
}

const oppositeGender = (gender?: string) =>
  gender === Gender.male ? Gender.female : Gender.male;

const FindMatchesDialog = ({ isOpen, onClose, data, refetch }: Props) => {
  const [filters, setFilters] = useState({
    gender: oppositeGender(data?.userId?.gender),
    minAge: "",
    maxAge: "",
    sect: "",
    maritalStatus: "",
    qualification: "",
    location: "",
  });
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<MatchCandidate[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sending, setSending] = useState(false);

  const handleSearch = async () => {
    try {
      setSearching(true);
      const res: any = await http.get(ENDPOINTS.PARTNER_REQUIREMENTS.MATCHES, {
        params: {
          gender: filters.gender,
          minAge: filters.minAge || undefined,
          maxAge: filters.maxAge || undefined,
          sect: filters.sect || undefined,
          maritalStatus: filters.maritalStatus || undefined,
          qualification: filters.qualification || undefined,
          location: filters.location || undefined,
          limit: 20,
        },
      });
      setResults(res?.data ?? []);
    } catch (error) {
      console.log(error);
    } finally {
      setSearching(false);
    }
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSendRecommendation = async () => {
    if (!selected.size) return;

    try {
      setSending(true);
      await http.post(ENDPOINTS.PARTNER_REQUIREMENTS.SEND_RECOMMENDATION, {
        userId: data.userId._id,
        recommendedUserIds: Array.from(selected),
        requestId: data._id,
      });
      addToast({
        title: "Sent",
        color: "success",
        description: "Recommendation sent to the customer",
      });
      refetch?.();
      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" backdrop="blur" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <span>Find Matches for {data?.userId?.fullName}</span>
          <p className="text-xs font-normal text-default-500 line-clamp-2">
            Requirement: {data?.requirementText}
          </p>
        </ModalHeader>
        <ModalBody>
          <div className="grid sm:grid-cols-3 gap-3">
            {/* Locked: matches must always be the opposite gender of the
                person we're finding a partner for — admin cannot change it. */}
            <Input
              isReadOnly
              label="Gender"
              labelPlacement="outside"
              value={CommonUtils.formatTitle(filters.gender)}
            />
            <Input
              label="Min Age"
              labelPlacement="outside"
              type="number"
              value={filters.minAge}
              onChange={(e) =>
                setFilters((f) => ({ ...f, minAge: e.target.value }))
              }
            />
            <Input
              label="Max Age"
              labelPlacement="outside"
              type="number"
              value={filters.maxAge}
              onChange={(e) =>
                setFilters((f) => ({ ...f, maxAge: e.target.value }))
              }
            />
            <Select
              label="Sect"
              labelPlacement="outside"
              placeholder="Any"
              selectedKeys={filters.sect ? new Set([filters.sect]) : new Set([])}
              onChange={(e) =>
                setFilters((f) => ({ ...f, sect: e.target.value }))
              }
            >
              {Object.values(Sects).map((item) => (
                <SelectItem key={item}>
                  {CommonUtils.formatTitle(item)}
                </SelectItem>
              ))}
            </Select>
            <Select
              label="Marital Status"
              labelPlacement="outside"
              placeholder="Any"
              selectedKeys={
                filters.maritalStatus ? new Set([filters.maritalStatus]) : new Set([])
              }
              onChange={(e) =>
                setFilters((f) => ({ ...f, maritalStatus: e.target.value }))
              }
            >
              {Object.values(MaritalStatus).map((item) => (
                <SelectItem key={item}>
                  {CommonUtils.formatTitle(item)}
                </SelectItem>
              ))}
            </Select>
            <MetadataDropdown
              label="Qualification"
              labelPlacement="outside"
              placeholder="Any"
              metadataType={MetadataTypes.qualification}
              selectedKey={filters.qualification}
              onSelectionChange={(key) =>
                setFilters((f) => ({ ...f, qualification: (key as string) ?? "" }))
              }
            />
          </div>

          <div className="flex justify-end mt-3">
            <Button color="primary" isLoading={searching} onPress={handleSearch}>
              Search
            </Button>
          </div>

          <Table shadow="none" className="mt-3">
            <TableHeader>
              <TableColumn>Profile</TableColumn>
              <TableColumn>Age / Height</TableColumn>
              <TableColumn>Sect / Qualification</TableColumn>
              <TableColumn>Location</TableColumn>
              <TableColumn align="end">Select</TableColumn>
            </TableHeader>
            <TableBody emptyContent="Search to see candidate profiles.">
              {results.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar
                        size="sm"
                        name={item.fullName}
                        src={item.profilePhoto?.url}
                      />
                      <div>
                        <p className="text-sm font-medium">{item.fullName}</p>
                        <p className="text-xs text-default-500">
                          {item.userId}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">
                      {item.dob
                        ? `${dayjs().diff(dayjs(item.dob), "year")} yrs`
                        : "-"}{" "}
                      {item.height ? `/ ${item.height} cm` : ""}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm capitalize">
                      {item.sect || "-"} / {item.qualification || "-"}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">
                      {CommonUtils.formatLocation({
                        city: item.address?.cityName || "",
                        state: item.address?.stateName || "",
                        country: item.address?.countryName || "",
                      })}
                    </p>
                  </TableCell>
                  <TableCell className="flex justify-end">
                    <Checkbox
                      isSelected={selected.has(item._id)}
                      onValueChange={() => toggleSelect(item._id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ModalBody>
        <ModalFooter>
          {selected.size > 0 && (
            <Chip color="secondary" variant="flat">
              {selected.size} selected
            </Chip>
          )}
          <Button variant="flat" onPress={onClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            isDisabled={!selected.size}
            isLoading={sending}
            onPress={handleSendRecommendation}
          >
            Send Recommendation
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FindMatchesDialog;
