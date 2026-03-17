import type { NuxtError } from '#app';
import { toast } from 'vue-sonner';

export const useSplitUpStore = defineStore('split-up', () => {
    // ***MEMBERS***
    const members = ref<Member[]>([]);

    const getMembers = async () => {
        members.value = await $fetch<Member[]>('/api/members');
    };

    const addMember = async (member?: Member) => {
        try {
            // Validar nombre
            const memberName = member?.name?.trim() || 'Nuevo Participante';
            if (memberName.length < 1) {
                toast.error('El nombre del miembro es requerido');
                return;
            }
            if (memberName.length > 50) {
                toast.error('El nombre no puede exceder 50 caracteres');
                return;
            }

            // Validar nombres duplicados
            const existingMember = members.value.find(m =>
                m?.name?.toLowerCase() === memberName.toLowerCase()
            );

            if (existingMember) {
                toast.error('Ya existe un miembro con ese nombre');
                return;
            }

            const newMember: Member = await $fetch<Member>('/api/members', {
                method: 'POST',
                body: { name: memberName.trim(), active: member?.active ?? false }
            })

            members.value.push(newMember);
            toast.success('Miembro agregado correctamente');

        } catch (e){
            console.error("Error al guardar miembro", e);
            toast.error('Error al agregar miembro');
        };
    };

    const updateMember = async (member: Member) => {
        try {
            // Validar que el miembro existe
            if (!member.id) {
                toast.error('ID del miembro es requerido');
                return;
            }

            // Validar nombre
            if (!member.name?.trim()) {
                toast.error('El nombre del miembro es requerido');
                return;
            }

            if (member.name.length > 50) {
                toast.error('El nombre no puede exceder 50 caracteres');
                return;
            }

            // Validar que el miembro existe en la lista local
            const existingMember = members.value.find(m => m.id === member.id);
            if (!existingMember) {
                toast.error('El miembro no existe');
                return;
            }

            await $fetch(`/api/members/${member.id}`, {
                method: 'PUT',
                body: {
                    name: member.name.trim(),
                    active: member.active,
                }
            });

            const index = members.value.findIndex(m => m.id === member.id);

            if (index !== -1) {
                members.value[index] = member;
            }

            toast.success('Miembro actualizado correctamente');

        } catch(e) {
            console.error("Error al actualizar miembro", e);
            toast.error('Error al actualizar miembro');
        }
    };

    const deleteMember = async (member: Member) => {
        try {

            // Validar que el miembro existe
            if (!members.value.find(m => m.id === member.id)) {
                toast.error('El miembro no existe');
                return;
            }

            await $fetch<string>(`/api/members/${member.id}`, {
                method: 'DELETE',
            });

            members.value = members.value.filter(m => m.id !== member.id);

            toast.success('Miembro eliminado correctamente');
        } catch(e) {
            showError(e as NuxtError);
        };
    };


    // ***PLACES***
     const places = ref<Place[]>([]);

    const getPlaces = async () => {
        places.value = await $fetch<Place[]>('/api/places');
    };

    const addPlace = async (place?: Place) => {
        try {
           
            // Validar nombre
            const placeName = place?.name?.trim() || 'Nuevo comercio';
            if (placeName.length < 1) {
                toast.error('El nombre del comercio es requerido');
                return;
            }
            if (placeName.length > 50) {
                toast.error('El nombre no puede exceder 50 caracteres');
                return;
            }

            // Validar nombres duplicados
            const existingPlace = places.value.find(p =>
                p?.name?.toLowerCase() === placeName?.toLowerCase()
            );

            if (existingPlace) {
                toast.error('Ya existe un comercio con ese nombre');
                return;
            }

            const newPlace: Place = await $fetch<Place>('/api/places', {
                method: 'POST',
                body: { name: placeName.trim() }
            })

            places.value.push(newPlace);
            toast.success('Comercio agregado correctamente');

            return newPlace;

        } catch(e) {
            console.error("Error al guardar comercio", e);
            showError(e as NuxtError);
        };
    };

    const updatePlace = async (place: Place) => {
        try {
            // Validar que el comercio existe
            if (!place.id) {
                toast.error('ID del comercio es requerido');
                return;
            }

            // Validar nombre
            if (!place.name?.trim()) {
                toast.error('El nombre del comercio es requerido');
                return;
            }

            if (place.name.length > 50) {
                toast.error('El nombre no puede exceder 50 caracteres');
                return;
            }

            // Validar que el comercio existe en la lista local
            const existingPlace = places.value.find(p => p.id === place.id);
            if (!existingPlace) {
                toast.error('El comercio no existe');
                return;
            }

            const updatedPlace = await $fetch<Place>(`/api/places/${place.id}`, {
                method: 'PUT',
                body: {
                    name: place.name.trim(),
                }
            });

            const index = places.value.findIndex(p => p.id === place.id)

            if (index !== -1) {
                places.value[index] = updatedPlace;
            }

            toast.success('Comercio actualizado correctamente');
        } catch(e) {
            showError(e as NuxtError);
        }
    };

    const deletePlace = async (place: Place) => {
        try {

            // Validar que el comercio existe
            if (!places.value.find(p => p.id === place.id)) {
                toast.error('El comercio no existe');
                return;
            }

            await $fetch<string>(`/api/places/${place.id}`, {
                method: 'DELETE',
            });

            places.value = places.value.filter(p => p.id !== place.id);
            toast.success('Comercio eliminado correctamente');
        } catch(e) {
            showError(e as NuxtError);
        };
    };

        // ***BILLS***
     const bills = ref<Bill[]>([]);

     const getBills = async () => {
        bills.value = await $fetch<Bill[]>('/api/bills');
        
    };

    const addBill = async (bill: Bill) => {
          try {
              if (!bill == null) return; 
           console.log("Guardando factura", bill);
            const newBill: Bill = await $fetch<Bill>('/api/bills', {
                method: 'POST',
                body: { placeId: bill.placeId,
                    date: bill.date,
                    amount: bill.amount,
                    isPaid: bill.isPaid ?? false,
                 }
            })

            bills.value.push(newBill);
            toast.success('Factura agregada correctamente');

            return newBill;

        } catch(e) {
            console.error("Error al guardar factura", e);
            showError(e as NuxtError);
        };
    };

        const updateBill = async (bill: Bill) => {
        try {
            // Validar que la factura existe
            if (!bill.id) {
                toast.error('ID de la factura es requerido');
                return;
            }

            // Validar monto
            if (!bill.amount) {
                toast.error('El monto de la factura es requerido');
                return;
            }

            const updatedBill = await $fetch<Bill>(`/api/bills/${bill.id}`, {
                method: 'PUT',
                body: {
                    placeId: bill.placeId,
                    date: bill.date,
                    amount: bill.amount,
                    isPaid: bill.isPaid ?? false,
                }
            });

            const index = bills.value.findIndex(p => p.id === bill.id)

            if (index !== -1) {
                bills.value[index] = updatedBill;
            }

            toast.success('Factura actualizada correctamente');
        } catch(e) {
            showError(e as NuxtError);
        }
    };

        const deleteBill = async (bill: Bill) => {
        try {

            // Validar que la factura existe
            if (!bills.value.find(p => p.id === bill.id)) {
                toast.error('La factura no existe');
                return;
            }

            await $fetch<string>(`/api/bills/${bill.id}`, {
                method: 'DELETE',
            });

            bills.value = bills.value.filter(p => p.id !== bill.id);
            toast.success('Factura eliminada correctamente');
        } catch(e) {
            showError(e as NuxtError);
        };
    };

    return {
        //---properties---
        members,
        places,
        bills,

        //---actions---
        //members
        getMembers,
        addMember,
        updateMember,
        deleteMember,

        //places
        getPlaces,
        addPlace,
        updatePlace,
        deletePlace,

        //bills
        getBills,
        addBill,
        updateBill,
        deleteBill,
    };
},);