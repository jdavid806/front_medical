// import React from "react";
// import { ConfigColumns } from "datatables.net-bs5";
// import CustomDataTable from "../components/CustomDataTable.js";
// import { useAllTableUsers } from "./hooks/useAllTableUsers.js";
// import { UserTableActions } from "./UserTableActions.js";
// import { UserDto } from "../models/models.js";

// const UserTable = () => {
//   const { users } = useAllTableUsers();

//   const columns: ConfigColumns[] = [
//     { data: "fullName" },
//     { data: "specialty" },
//     { data: "gender" },
//     { data: "phone" },
//     { data: "email" },
//     { orderable: false, searchable: false },
//   ];

//   const slots = {
//     5: (cell, data: UserDto) => <UserTableActions></UserTableActions>,
//   };

//   return (
//     <>
//       <div className="card mb-3">
//         <div className="card-body">
//           <CustomDataTable data={users} slots={slots} columns={columns}>
//             <thead>
//               <tr>
//                 <th className="border-top custom-th">Nombre</th>
//                 <th className="border-top custom-th">Especialidad</th>
//                 <th className="border-top custom-th">Género</th>
//                 <th className="border-top custom-th">Número de contacto</th>
//                 <th className="border-top custom-th">Correo</th>
//                 <th
//                   className="text-end align-middle pe-0 border-top mb-2"
//                   scope="col"
//                 ></th>
//               </tr>
//             </thead>
//           </CustomDataTable>
//         </div>
//       </div>
//     </>
//   );
// };

// export default UserTable;