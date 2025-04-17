import type { ModuleInstance } from './main.js'

export function UpdateVariableDefinitions(self: ModuleInstance): void {
	self.setVariableDefinitions([
		{ variableId: 'currentFirmwareMode', name: 'Current Firmware Mode' },
		{ variableId: 'currentSystemMode', name: 'Current System Mode' },
		{ variableId: 'device', name: 'Device' },
		{ variableId: 'fpgaVersion', name: 'FPGA Version' },
		{ variableId: 'frontPanelRevision', name: 'Front Panel Revision' },
		{ variableId: 'imageVersion', name: 'Image Version' },
		{ variableId: 'jitterAdcSpan', name: 'Jitter ADC Span' },
		{ variableId: 'mainBoardRevision', name: 'Main Board Revision' },
		{ variableId: 'mezzanineBoardRevision', name: 'Mezzanine Board Revision' },
		{ variableId: 'sha', name: 'SHA' },
		{ variableId: 'softwareBranch', name: 'Software Branch' },
		{ variableId: 'softwareNumber', name: 'Software Number' },
		{ variableId: 'softwareVersion', name: 'Software Version' },
		{ variableId: 'status', name: 'Status Code' },
		{ variableId: 'timeOnUnit', name: 'Time on Unit' },
		{ variableId: 'toolchainVersion', name: 'Toolchain Version' },
		{ variableId: 'message', name: 'Message' },

		// Driver Gains A–D, 4 rates each
		{ variableId: 'driver_a_gain_1_5g', name: 'Driver A Gain 1.5G' },
		{ variableId: 'driver_a_gain_3g', name: 'Driver A Gain 3G' },
		{ variableId: 'driver_a_gain_6g', name: 'Driver A Gain 6G' },
		{ variableId: 'driver_a_gain_12g', name: 'Driver A Gain 12G' },

		{ variableId: 'driver_b_gain_1_5g', name: 'Driver B Gain 1.5G' },
		{ variableId: 'driver_b_gain_3g', name: 'Driver B Gain 3G' },
		{ variableId: 'driver_b_gain_6g', name: 'Driver B Gain 6G' },
		{ variableId: 'driver_b_gain_12g', name: 'Driver B Gain 12G' },

		{ variableId: 'driver_c_gain_1_5g', name: 'Driver C Gain 1.5G' },
		{ variableId: 'driver_c_gain_3g', name: 'Driver C Gain 3G' },
		{ variableId: 'driver_c_gain_6g', name: 'Driver C Gain 6G' },
		{ variableId: 'driver_c_gain_12g', name: 'Driver C Gain 12G' },

		{ variableId: 'driver_d_gain_1_5g', name: 'Driver D Gain 1.5G' },
		{ variableId: 'driver_d_gain_3g', name: 'Driver D Gain 3G' },
		{ variableId: 'driver_d_gain_6g', name: 'Driver D Gain 6G' },
		{ variableId: 'driver_d_gain_12g', name: 'Driver D Gain 12G' },

		// Eye
		{ variableId: 'eye_dcGain', name: 'Eye DC Gain' },
		{ variableId: 'eye_gain', name: 'Eye Gain' },
		{ variableId: 'eye_offset', name: 'Eye Offset' },
		{ variableId: 'eye_eyeCalRevision', name: 'Eye Calibration Revision' },

		// Eye displayGains
		{ variableId: 'eye_display_gain_270m', name: 'Eye Display Gain 270M' },
		{ variableId: 'eye_display_gain_1_5g', name: 'Eye Display Gain 1.5G' },
		{ variableId: 'eye_display_gain_3g', name: 'Eye Display Gain 3G' },
		{ variableId: 'eye_display_gain_6g', name: 'Eye Display Gain 6G' },
		{ variableId: 'eye_display_gain_12g', name: 'Eye Display Gain 12G' },

		// Eye measurementGains
		{ variableId: 'eye_measure_gain_270m', name: 'Eye Measurement Gain 270M' },
		{ variableId: 'eye_measure_gain_1_5g', name: 'Eye Measurement Gain 1.5G' },
		{ variableId: 'eye_measure_gain_3g', name: 'Eye Measurement Gain 3G' },
		{ variableId: 'eye_measure_gain_6g', name: 'Eye Measurement Gain 6G' },
		{ variableId: 'eye_measure_gain_12g', name: 'Eye Measurement Gain 12G' },
	])
}
