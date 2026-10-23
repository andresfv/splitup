import { toast } from 'vue-sonner';

//TODO: Mejorar validaciones del lado del servidor, de forma que devuelva errores más especificos con status 400
export const useSplitUpStore = defineStore('split-up', () => {

    // ***BILLS FILTER DATES***
    const fromDate = ref<Date | null>(normalizeDate(getFirstDayOfCurrentMonth()));
    const toDate = ref<Date | null>(normalizeDate(getLastDayOfCurrentMonth()));

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

        } catch (e) {
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
                // members.value[index] = member;
                members.value = members.value.map(m =>
                    m.id === member.id ? member : m
                );
            }

            toast.success('Miembro actualizado correctamente');

        } catch (e) {
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
        } catch (e) {
            handleFetchError(e);
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

        } catch (e) {
            console.error("Error al guardar comercio", e);
            handleFetchError(e);
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
                // places.value[index] = updatedPlace;
                places.value = places.value.map(p =>
                    p.id === updatedPlace.id ? updatedPlace : p
                );
            }

            toast.success('Comercio actualizado correctamente');
        } catch (e) {
            handleFetchError(e);
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
        } catch (e) {
            handleFetchError(e);
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
            const newBill: Bill = await $fetch<Bill>('/api/bills', {
                method: 'POST',
                body: {
                    placeId: bill.placeId,
                    date: bill.date,
                    amount: bill.amount,
                }
            })

            bills.value.push(newBill);
            toast.success('Factura agregada correctamente');

            return newBill;

        } catch (e) {
            console.error("Error al guardar factura", e);
            handleFetchError(e);
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
                    date: new Date (bill.date),
                    amount: bill.amount,
                }
            });

            const index = bills.value.findIndex(p => p.id === bill.id)

            if (index !== -1) {
                bills.value = bills.value.map(b =>
                    b.id === updatedBill.id ? updatedBill : b
                );
            }

            toast.success('Factura actualizada correctamente');
        } catch (e) {
            handleFetchError(e);
        }
    };

    const deleteBill = async (bill: Bill) => {
        try {

            // Validar que la factura existe
            if (!bills.value.find(p => p.id === bill.id)) {
                toast.error('La factura no existe');
                return;
            }

            //Busca miembros asociados a la factura y los elimina de ella antes de eliminarla
            const billMembersToDelete = getBillMembersByBillId(bill.id);
            for (const bm of billMembersToDelete) {
                await deleteBillMember(bm);
            }

            await $fetch<string>(`/api/bills/${bill.id}`, {
                method: 'DELETE',
            });

            bills.value = bills.value.filter(p => p.id !== bill.id);
            toast.success('Factura eliminada correctamente');
        } catch (e) {
            handleFetchError(e);
        };
    };

    const getBillsBetweenDates = (fromDate: Date | null, toDate: Date | null) => {

        if(!fromDate || !toDate){
            return [];
        }

        // Normalizar fechas para comparar solo día/mes/año (sin hora)
        const fromDateNormalized = normalizeDate(fromDate);
        const toDateNormalized = normalizeDate(toDate);
        const filteredBills: Bill[] = [];

        for(const bill of bills.value){
            const billDateNormalized = normalizeDate(bill.date);

            // Si la fecha de la factura está fuera del rango, saltar a la siguiente iteración
            if(billDateNormalized < fromDateNormalized || billDateNormalized > toDateNormalized){
                continue;
            }

            filteredBills.push(bill);
        }

        filteredBills.sort((a, b) => normalizeDate(b.date).getTime() - normalizeDate(a.date).getTime());

        return filteredBills
    }

    /**
     * Obtiene un resumen de una factura específica, incluyendo el total, lo pagado, lo pendiente, la cantidad de miembros asociados y el total de los seleccionados.
     * @param billId El ID de la factura para la cual se desea obtener el resumen.
     * @returns Un objeto BillSummaryDTO con los detalles del resumen de la factura. Si la factura no existe, devuelve un resumen con valores en cero.
     */
    const getBillSumary = (billId: number): BillSummaryDTO => {
        const bill = bills.value.find(b => b.id === billId);
        if (!bill) {
            return {
                    total: 0,
                    paid: 0,
                    pending: 0,
                    count: 0
            }
        }

        const billMembersByBill = getBillMembersByBillId(billId);
        let paidAmount = 0;

        for (const bm of billMembersByBill) {
            if (bm.isPaid) {
                paidAmount += bm.amount;
            }
        }

        const billAmount = bill.amount ?? 0;
        const pendingAmount = billAmount - paidAmount;

        return {
            total: billAmount,
            paid: paidAmount,
            pending: pendingAmount,
            count: billMembersByBill.length
        };
    }

    // ***BILL_MEMBERS***
    const billMembers = ref<BillMember[]>([]);

    const billMembersSelected = ref<BillMember[]>([]);

    const getBillMembers = async () => {
        billMembers.value = await $fetch<BillMember[]>('/api/bills-members');
    };

    const getBillMembersByBillId = (billId: number) => {
        return billMembers.value.filter(bm => bm.billId === billId);
    }

    const addBillMember = async (billMember: BillMember) => {
        try {
            if (!billMember == null) return;
            const newBillMember: BillMember = await $fetch<BillMember>('/api/bills-members', {
                method: 'POST',
                body: {
                    billId: billMember.billId,
                    memberId: billMember.memberId,
                    amount: billMember.amount,
                    isPaid: billMember.isPaid ?? false,
                }
            })

            billMembers.value.push(newBillMember);

            return newBillMember;

        } catch (e) {
            console.error("Error al guardar factura persona", e);
            handleFetchError(e);
        };
    };

    const updateBillMember = async (billMember: BillMember) => {
        try {
            const updatedBill = await $fetch<BillMember>(`/api/bills-members/${billMember.id}`, {
                method: 'PUT',
                body: {
                    billId: billMember.billId,
                    memberId: billMember.memberId,
                    amount: billMember.amount,
                    isPaid: billMember.isPaid ?? false,
                }
            });

            const index = billMembers.value.findIndex(p => p.id === billMember.id)

            if (index !== -1) {
                // billMembers.value[index] = updatedBill;
                billMembers.value = billMembers.value.map(b =>
                    b.id === updatedBill.id ? updatedBill : b
                );
            }
        } catch (e) {
            handleFetchError(e);
        }
    };

    const deleteBillMember = async (billMember: BillMember) => {
        try {
            await $fetch<string>(`/api/bills-members/${billMember.id}`, {
                method: 'DELETE',
            });

            billMembers.value = billMembers.value.filter(p => p.id !== billMember.id);
        } catch (e) {
            handleFetchError(e);
        };
    };

    const isBillPaid = (billId: number) => {
        const billMembersByBill = getBillMembersByBillId(billId);
        let paidAmount = 0;
        
        for (const bm of billMembersByBill) {
            if (bm.isPaid) {
                paidAmount += bm.amount;
            }
        }

        const bill = bills.value.find(b => b.id === billId);
        const billAmount = bill?.amount ?? 0;
        
        return billAmount <= paidAmount;
    }

    /**
     * Inicializa los datos necesarios para la aplicación, como miembros, comercios, facturas y relaciones factura-miembro. 
     * Si alguna de las listas ya contiene datos, se omite la llamada a la API correspondiente para evitar cargas innecesarias.
     */
    const initData = async () => {
        await Promise.all([
            places.value.length === 0 ? getPlaces() : null,
            members.value.length === 0 ? getMembers() : null,
            bills.value.length === 0 ? getBills() : null,
            billMembers.value.length === 0 ? getBillMembers() : null
        ]);
    };

    /**
     * Actualiza los detalles de una relación factura-miembro específica, como el estado de pago y el monto correspondiente.
     * @param billMemberId El ID de la relación factura-miembro que se desea actualizar.
     */
    function updateBillItem(billItem: BillMemberDetailsDTO) {

        const billMember: BillMember|undefined = billMembers.value.find(
            b => b.id === billItem.id
        );

        if (!billMember) return;

        billMember.isPaid = billItem.isPaid;
        billMember.amount = billItem.amount;

        updateBillMember(billMember);
    }

    /**
     * Permite marcar como pagadas todas las facturas asociadas a un miembro específico.
     * @param memberId El ID del miembro para el cual se desean marcar todas las facturas como pagadas.
     */
    function payAllBillMemberItems(memberBillItems: BillMemberDetailsDTO[]) {
        for (const billItem of memberBillItems) {
            billItem.isPaid = true;
            updateBillItem(billItem);
        }
    }

    // ***BillItem***

    /**
     * Obtiene una lista de facturas asociadas a un miembro específico dentro de un rango de fechas determinado.
     * @param memberId El ID del miembro para el cual se desean obtener las facturas.
     * @param fromDate Fecha de inicio del rango.
     * @param toDate Fecha de fin del rango.
     * @returns Lista de facturas asociadas al miembro dentro del rango de fechas. Si no hay facturas, devuelve una lista vacía.
     */
    function getMemberBillItemsBetweenDates(memberId: number, fromDate: Date, toDate: Date) : BillMemberDetailsDTO[] {
    
        const billMembersFiltered = billMembers.value.filter(
            bm => bm.memberId === memberId
        );
        
        const billItems: BillMemberDetailsDTO[] = [];

        const billsMap = new Map(
            bills.value.map(b => [b.id, b])
        );

        const placesMap = new Map(
            places.value.map(p => [p.id, p])
        );

        // Normalizar fechas para comparar solo día/mes/año (sin hora)
        const fromDateNormalized = normalizeDate(fromDate);
        const toDateNormalized = normalizeDate(toDate);
        
        for (const billMember of billMembersFiltered) {
            
            const bill = billsMap.get(billMember.billId);
            
            if (bill == null) {
                console.warn("Factura no encontrada para el miembro:", memberId, "Factura ID:", billMember.billId);
                continue;
            }
            
            // Normalizar la fecha de la factura para comparar solo la parte de fecha
            const billDateNormalized = normalizeDate(bill.date);
            
            // Si la fecha de la factura está fuera del rango, saltar a la siguiente iteración
            if(billDateNormalized < fromDateNormalized || billDateNormalized > toDateNormalized){
                continue;
            }
            
            const place = placesMap.get(bill.placeId);

            if (place == null) {
                console.warn("Lugar no encontrado para la factura:", bill.id, "Lugar ID:", bill.placeId);
                continue;
            }

            billItems.push({
                id: billMember.id,
                placeName: place.name,
                date: new Date (bill.date),
                amount: billMember.amount,
                isPaid: billMember.isPaid,
                isSelected: false
            });
        }

        return billItems;
    }

    /**
     * Calcula el monto total de las facturas de un miembro dentro de un rango de fechas.
     * @param memberId El ID del miembro para el cual se desea calcular el monto.
     * @param fromDate Fecha de inicio del rango.
     * @param toDate Fecha de fin del rango.
     * @returns Monto total de las facturas del miembro dentro del rango de fechas.
     */
    function getMemberBillSummary(memberId: number, fromDate: Date, toDate: Date): BillSummaryDTO {
        const billItems = getMemberBillItemsBetweenDates(memberId, fromDate, toDate);

        let total = 0;
        let paid = 0;
        let pending = 0;

        for (const item of billItems) {

            total += item.amount;

            if (item.isPaid) {
                paid += item.amount;
            } else {
                pending += item.amount;
            }
        }

        return {
            total,
            paid,
            pending,
            count: billItems.length
        };
    }
    
    /**
     * Calcula el monto que le corresponde pagar a cada miembro de forma equitativa para todas las facturas dentro de un rango de fechas determinado.
     * @param fromDate Fecha de inicio del rango.
     * @param toDate Fecha de fin del rango.
     */
    function splitBillAmountsEquallyBetweenMembers(fromDate: Date, toDate: Date) {
        if(!fromDate || !toDate){
            console.warn("Rango de fechas no válido");
            return;
        }

        // Normalizar fechas para comparar solo día/mes/año (sin hora)
        const fromDateNormalized = normalizeDate(fromDate);
        const toDateNormalized = normalizeDate(toDate);
        
        const billsInRange = bills.value.filter(b => {
            const billDateNormalized = normalizeDate(b.date);
            return billDateNormalized >= fromDateNormalized && billDateNormalized <= toDateNormalized;
        });
        
        for(const bill of billsInRange){
            const billMemberByBill = billMembers.value.filter(bm => bm.billId === bill.id);
            const membersCount = billMemberByBill.length;

            if (membersCount === 0) { continue; }
            
            const amountPerMember =  bill.amount / membersCount;
            for(const billMember of billMemberByBill){
                billMember.amount = amountPerMember;
                updateBillMember(billMember);
            }
        }
    }

    function addBillMemberToSelected(billMemberDto: BillMemberDetailsDTO) {
        const billMemberItem = billMembers.value.find(bm => bm.id === billMemberDto.id);
        if (billMemberDto.isSelected) {
            billMembersSelected.value.push(billMemberItem as BillMember);
        }else{
            billMembersSelected.value = billMembersSelected.value.filter(bm => bm.id !== billMemberDto.id);
        }
    }

    return {
        //---properties---
        fromDate,
        toDate,
        members,
        places,
        bills,
        billMembers,
        billMembersSelected,

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
        getBillsBetweenDates,
        getBillSumary,
        isBillPaid,

        //billMembers
        getBillMembers,
        addBillMember,
        updateBillMember,
        deleteBillMember,
        updateBillItem,
        addBillMemberToSelected,

        //billItems
        getMemberBillItemsBetweenDates,
        getMemberBillSummary,
        splitBillAmountsEquallyBetweenMembers,
        payAllBillMemberItems,

        //init
        initData,
    };
},);