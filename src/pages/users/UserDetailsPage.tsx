import ENDPOINTS from "@/api/endpoints";
import http from "@/api/http";
import ViewPhotosDialog from "@/components/dialogs/ViewPhotosDialog";
import BackButton from "@/components/lib/BackButton";
import LoadingProgress from "@/components/lib/LoadingProgress";
import { User } from "@/types/types";
import CommonUtils from "@/utils/common.utils";
import {
  Button,
  Card,
  Chip,
  Divider,
  Image,
  User as UserChip,
  addToast,
} from "@heroui/react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { MdVerified } from "react-icons/md";
import {
  HiOutlineAcademicCap,
  HiOutlineCamera,
  HiOutlineInformationCircle,
  HiOutlineLocationMarker,
  HiOutlineTranslate,
  HiOutlineUser,
} from "react-icons/hi";
import { MdFamilyRestroom } from "react-icons/md";
import { useParams } from "react-router-dom";

const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value: string | number | boolean | undefined | null;
}) => {
  let displayValue: string = "-";
  if (value === true) displayValue = "Yes";
  else if (value === false) displayValue = "No";
  else if (value) displayValue = String(value);

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-default-500 font-medium uppercase tracking-wider">
        {label}
      </span>
      <span className="text-sm font-semibold text-default-700">
        {CommonUtils.formatTitle(displayValue)}
      </span>
    </div>
  );
};

const Section = ({
  title,
  children,
  icon: Icon,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  icon?: any;
  className?: string;
}) => (
  <Card
    className={`p-5 shadow-sm border-none bg-white backdrop-blur-md ${className}`}
  >
    <div className="flex items-center gap-2 mb-4">
      <div className="p-2 rounded-lg bg-primary/10 text-primary">
        {Icon && <Icon size={20} />}
      </div>
      <h3 className="text-lg font-bold text-default-800">{title}</h3>
    </div>
    <Divider className="mb-6 opacity-50" />
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {children}
    </div>
  </Card>
);

const UserDetailsPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [photosModal, setPhotosModal] = useState<any>({
    isOpen: false,
    photos: [],
    initialIndex: 0,
  });

  const getDetails = async () => {
    try {
      setLoading(true);
      const res = await http.get(ENDPOINTS.USERS.DETAILS(id!));
      setUser(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVerified = async () => {
    if (!user) return;
    const next = !user.isVerified;
    try {
      setVerifying(true);
      await http.put(ENDPOINTS.USERS.VERIFY(user._id), { isVerified: next });
      setUser({ ...user, isVerified: next });
      addToast({
        title: "Success",
        description: next ? "User verified" : "Verification removed",
        color: "success",
      });
    } catch (error) {
      console.log(error);
    } finally {
      setVerifying(false);
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!window.confirm("Are you sure you want to delete this photo?")) return;

    try {
      await http.delete(ENDPOINTS.ATTACHMENTS.DELETE(photoId));
      addToast({
        title: "Success",
        description: "Photo deleted successfully",
        color: "success",
      });
      getDetails();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDetails();
  }, [id]);

  if (loading) return <LoadingProgress />;

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-content1 p-6 rounded-2xl shadow-sm">
        <div className="flex items-center gap-4">
          <BackButton />
          <UserChip
            description={user?.mobile}
            name={`${user?.fullName} (${user?.userId})`}
            avatarProps={{
              src: user?.profilePhoto?.url,
              className: "w-16 h-16 text-large",
              name: user?.fullName?.[0],
            }}
            classNames={{
              name: "text-2xl font-bold",
              description: "text-default-500 text-base",
            }}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {user?.isVerified && (
            <Chip
              color="primary"
              variant="flat"
              startContent={<MdVerified size={16} />}
            >
              Verified
            </Chip>
          )}
          <Chip
            color={user?.isOnboardingCompleted ? "success" : "warning"}
            variant="flat"
            className="capitalize"
          >
            Onboarding: {user?.isOnboardingCompleted ? "Completed" : "Pending"}
          </Chip>
          <Chip
            color={user?.isPrivate ? "secondary" : "default"}
            variant="flat"
            className="capitalize"
          >
            {user?.isPrivate ? "Private Profile" : "Public Profile"}
          </Chip>
          <Button
            size="sm"
            variant={user?.isVerified ? "bordered" : "solid"}
            color="primary"
            isLoading={verifying}
            startContent={!verifying && <MdVerified size={16} />}
            onClick={handleToggleVerified}
          >
            {user?.isVerified ? "Remove Verification" : "Verify User"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Section title="Basic Information" icon={HiOutlineUser}>
            <DetailItem label="Full Name" value={user?.fullName} />
            <DetailItem label="Gender" value={user?.gender} />
            <DetailItem
              label="Date of Birth"
              value={user?.dob ? dayjs(user.dob).format("DD MMM YYYY") : "-"}
            />
            <DetailItem
              label="Age"
              value={
                user?.dob
                  ? dayjs().diff(dayjs(user.dob), "year") + " Years"
                  : "-"
              }
            />
            <DetailItem
              label="Height"
              value={user?.height ? `${user.height} cm` : "-"}
            />
            <DetailItem label="Profile For" value={user?.profileFor} />
            <DetailItem label="Mother Tongue" value={user?.language} />
            <DetailItem label="App Language" value={user?.appLanguage} />
          </Section>

          <Section title="Religious & Social" icon={HiOutlineTranslate}>
            <DetailItem label="Sect" value={user?.sect} />
            <DetailItem label="Maslak" value={user?.maslak} />
            <DetailItem label="Community" value={user?.community} />
            <DetailItem label="Marital Status" value={user?.maritalStatus} />
            <DetailItem
              label="Family living with user?"
              value={user?.isFamilyLivingWithUser}
            />
          </Section>

          <Section title="Education & Professional" icon={HiOutlineAcademicCap}>
            <DetailItem label="Qualification" value={user?.qualification} />
            <DetailItem label="Work Sector" value={user?.workSector} />
            <DetailItem label="Annual Income" value={user?.annualIncome} />
          </Section>

          {user?.family && (
            <Section title="Family Details" icon={MdFamilyRestroom}>
              <DetailItem
                label="Father's Name"
                value={user?.family?.fatherName}
              />
              <DetailItem
                label="Father's Occupation"
                value={user?.family?.fatherOccupation}
              />
              <DetailItem
                label="Father's Contact"
                value={user?.family?.fatherContact}
              />
              <DetailItem
                label="Mother's Name"
                value={user?.family?.motherName}
              />
              <DetailItem
                label="Mother's Occupation"
                value={user?.family?.motherOccupation}
              />
              <DetailItem
                label="Mother's Contact"
                value={user?.family?.motherContact}
              />
            </Section>
          )}

          <Section title="Location Details" icon={HiOutlineLocationMarker}>
            <DetailItem label="City" value={user?.address?.cityName} />
            <DetailItem label="State" value={user?.address?.stateName} />
            <DetailItem label="Country" value={user?.address?.countryName} />
          </Section>
        </div>

        <div className="lg:col-span-1">
          <Card className="p-5 shadow-sm border-none bg-white h-fit">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <HiOutlineInformationCircle size={20} />
              </div>
              <h3 className="text-lg font-bold text-default-800">
                Account Status
              </h3>
            </div>
            <Divider className="mb-4 opacity-50" />
            <div className="space-y-6">
              <DetailItem
                label="Created At"
                value={dayjs(user?.createdAt).format("DD MMM YYYY, hh:mm A")}
              />
              <DetailItem
                label="Last Updated"
                value={dayjs(user?.updatedAt).format("DD MMM YYYY, hh:mm A")}
              />
              <DetailItem label="User Type" value={user?.userType} />
            </div>
          </Card>
        </div>
      </div>

      <Card className="p-5 shadow-sm border-none bg-white w-full">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <HiOutlineCamera size={20} />
          </div>
          <h3 className="text-lg font-bold text-default-800">Photos</h3>
        </div>
        <Divider className="mb-6 opacity-50" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {user?.photos && user.photos.length > 0 ? (
            user.photos.map((photo, index) => (
              <div key={photo._id} className="relative group">
                <Image
                  src={photo.url}
                  alt={`${user.fullName} ${index + 1}`}
                  className="w-full aspect-square object-cover rounded-xl cursor-pointer hover:scale-105 transition-transform"
                  onClick={() =>
                    setPhotosModal({
                      isOpen: true,
                      photos: user.photos,
                      initialIndex: index,
                    })
                  }
                />
                <Button
                  isIconOnly
                  size="sm"
                  color="danger"
                  variant="flat"
                  className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleDeletePhoto(photo._id)}
                >
                  <FiTrash2 size={16} />
                </Button>
              </div>
            ))
          ) : (
            <div className="col-span-full py-10 text-center text-default-400">
              No photos uploaded
            </div>
          )}
        </div>
      </Card>

      {photosModal.isOpen && (
        <ViewPhotosDialog
          isOpen={photosModal.isOpen}
          photos={photosModal.photos}
          initialIndex={photosModal.initialIndex}
          onClose={() =>
            setPhotosModal({ isOpen: false, photos: [], initialIndex: 0 })
          }
        />
      )}
    </div>
  );
};

export default UserDetailsPage;
