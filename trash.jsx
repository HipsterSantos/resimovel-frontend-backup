  // const handleNext = ()=>{
    //     const currentActiveIndex = steps.findIndex(_=>_.active)
    //     if(currentActiveIndex < steps.length - 1){
    //         steps[currentActiveIndex].active = false;
    //         steps[currentActiveIndex + 1].active = true;
    //         setValues(oldValue=>({
    //             ...oldValue,
    //             activeStep: currentActiveIndex + 1
    //         }))
    //     }
    // }

    // const handleBack = ()=>{
    //     const currentActiveIndex = steps.findIndex(_=>_.active)
    //     if(currentActiveIndex > 0){
    //         steps[currentActiveIndex].active = false;
    //         steps[currentActiveIndex - 1].active = true;
    //         setValues(oldValue=>({
    //             ...oldValue,
    //             activeStep: currentActiveIndex - 1
    //         }))
    //         console.log('===active step ', values.activeStep)
    //     }
    // }


   
    const toggleStatus = (status) => {
        setSelectedStatus(prev =>
        prev.includes(status)
            ? prev.filter(s => s !== status)
            : [...prev, status]
        );

        handleChange('houseStatus')(
        selectedStatus.includes(status)
            ? selectedStatus.filter(s => s !== status)
            : [...selectedStatus, status]
        );
    };

    const toggleTrait = (trait) => {
    setSelectedTraits(prev =>
        prev.includes(trait)
        ? prev.filter(t => t !== trait)
        : [...prev, trait]
    );

    handleChange('otherTraits')(
        selectedTraits.includes(trait)
        ? selectedTraits.filter(t => t !== trait)
        : [...selectedTraits, trait]
    );
    };
