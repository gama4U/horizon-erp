import { OfficeBranch } from "@/interfaces/user.interface";

export function RenderHeaderText(branch: OfficeBranch) {
  let header = null;

  switch (branch) {
    case OfficeBranch.CEBU:
      header = (
        <>
          <h3 className="text-xs font-semibold">
            Unit 601 The Meridian, Golam Drive Kasambagan, Cebu City 6000
          </h3>
          <div className="flex flex-col text-xs">
            <span>Email Address: info@horizonexpress.ph</span>
            <span>Contact Number: 09171871163, 09171384197, 09171541138</span>
          </div>
        </>
      );
      break;

    case OfficeBranch.CALBAYOG:
      header = (
        <>
          <h3 className="text-xs font-semibold">
            262 Maharlika Highway Purok 2 Obrero Calbayog City 6710
          </h3>
          <div className="flex flex-col text-xs">
            <span>Email: info@horizonexpress.ph</span>
            <span>Contact Number: 09530856053, 09171025584, 09171833216</span>
          </div>
        </>
      );
      break;
    default:
      header = <span>No branch selected</span>;
  }
  return header;
}
