import BackButton from "./BackButton";

type Props = {
  title: string;
  description?: string;
  backPath?: string;
};

const FormHeading = ({ title, description, backPath }: Props) => {
  return (
    <div className="flex flex-col gap-1 mb-8 animate-in fade-in slide-in-from-left-4 duration-500">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <BackButton path={backPath} />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-default-900">
            {title}
          </h1>
          {description && (
            <p className="text-default-500 text-sm md:text-base max-w-2xl leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormHeading;
