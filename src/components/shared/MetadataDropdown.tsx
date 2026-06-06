import ENDPOINTS from "@/api/endpoints";
import http from "@/api/http";
import { MetadataTypes } from "@/types/enum";
import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteProps,
  Spinner,
} from "@heroui/react";
import { useEffect, useState } from "react";

type Option = {
  _id: string;
  name: string;
};

interface Props extends Omit<AutocompleteProps, "children"> {
  metadataType: MetadataTypes;
}

const MetadataDropdown = ({ metadataType, ...props }: Props) => {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<Option[]>([]);
  const [debounceTime, setDebounceTime] = useState<any>(null);

  const fetchOptions = async (search?: string) => {
    try {
      setLoading(true);
      const res = await http.get(ENDPOINTS.METADATA.LIST(metadataType), {
        params: {
          search,
          page: 1,
          limit: 1000,
        },
      });
      setOptions(res?.data ?? []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (ev: string) => {
    if (debounceTime) {
      clearTimeout(debounceTime);
    }

    setDebounceTime(
      setTimeout(() => {
        fetchOptions(ev.trim());
      }, 1500),
    );
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  return (
    <Autocomplete
      {...props}
      endContent={loading && <Spinner size="sm" />}
      onInputChange={handleSearch}
    >
      {options?.map((item) => (
        <AutocompleteItem key={item.name}>{item.name}</AutocompleteItem>
      ))}
    </Autocomplete>
  );
};

export default MetadataDropdown;
