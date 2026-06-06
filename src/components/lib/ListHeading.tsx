import { Button } from "@heroui/react";
import { MdAdd } from "react-icons/md";
import { Link } from "react-router-dom";

type Props = {
  title: string;
  description?: string;
  createAction?: string;
  createLabel?: string;
};

const ListHeading = ({
  title,
  description,
  createAction,
  createLabel = "Create",
}: Props) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
      <div className="space-y-1">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium uppercase tracking-wider mb-2">
          <span>Overview</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-default-900 bg-clip-text">
          {title}
        </h1>
        {description && (
          <p className="text-default-500 text-sm max-w-lg leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {createAction && (
        <div className="flex items-center gap-3">
          <Button
            as={Link}
            to={createAction}
            color="primary"
            radius="lg"
            variant="shadow"
            startContent={<MdAdd className="text-xl" />}
            className="font-semibold bg-gradient-to-r from-primary to-primary-600 shadow-xl shadow-primary/20 group transition-all duration-300 hover:scale-[1.02] active:scale-95"
          >
            {createLabel}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ListHeading;
