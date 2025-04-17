import { InstanceBase, runEntrypoint, InstanceStatus, SomeCompanionConfigField } from '@companion-module/base'
import { GetConfigFields, type ModuleConfig } from './config.js'
import { UpdateVariableDefinitions } from './variables.js'
import { UpgradeScripts } from './upgrades.js'
import { UpdateActions } from './actions.js'
import { UpdateFeedbacks } from './feedbacks.js'
import fetch from 'node-fetch'

export class ModuleInstance extends InstanceBase<ModuleConfig> {
	config!: ModuleConfig // Setup in init()

	constructor(internal: unknown) {
		super(internal)
	}

	async init(config: ModuleConfig): Promise<void> {
		this.config = config

		this.updateStatus(InstanceStatus.Ok)

		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions

		//todo: fill in all Variable Updates
		await this.updateSystemInfoVariables()

		//Start Polling loop
		await this.startVariableUpdatePolling()
	}
	// When module gets deleted
	async destroy(): Promise<void> {
		this.log('debug', 'destroy')
	}

	async configUpdated(config: ModuleConfig): Promise<void> {
		this.config = config
	}

	// Return config fields for web config
	getConfigFields(): SomeCompanionConfigField[] {
		return GetConfigFields()
	}

	updateActions(): void {
		UpdateActions(this)
	}

	updateFeedbacks(): void {
		UpdateFeedbacks(this)
	}

	updateVariableDefinitions(): void {
		UpdateVariableDefinitions(this)
	}

	async apiPost(path: string, body: Record<string, any>): Promise<any> {
		const url = `http://${this.config.host}:${this.config.port}/api/v1${path}`
		try {
			const response = await fetch(url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body),
			})
			if (!response.ok) throw new Error(await response.text())
			return await response.json()
		} catch (error) {
			this.log('error', `POST ${path} failed: ${error}`)
			return null
		}
	}

	async apiPut(path: string, body: Record<string, any>): Promise<any> {
		this.log('debug', 'Send Put request')
		const url = `http://${this.config.host}:${this.config.port}/api/v1${path}`
		try {
			const response = await fetch(url, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body),
			})
			if (!response.ok) throw new Error(await response.text())

			const text = await response.text()
			return text ? JSON.parse(text) : undefined
		} catch (error) {
			this.log('error', `PUT ${path} failed: ${error}`)
			return null
		}
	}

	async apiDelete(path: string): Promise<any> {
		const url = `http://${this.config.host}:${this.config.port}/api/v1${path}`
		try {
			const response = await fetch(url, {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
			})
			if (!response.ok) throw new Error(await response.text())
			return await response.json()
		} catch (error) {
			this.log('error', `DELETE ${path} failed: ${error}`)
			return null
		}
	}

	async apiGet(path: string): Promise<any> {
		this.log('debug', 'Send GET request')
		const url = `http://${this.config.host}:${this.config.port}/api/v1${path}`
		try {
			const response = await fetch(url, {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			})
			if (!response.ok) throw new Error(await response.text())

			const text = await response.text()
			return text ? JSON.parse(text) : undefined
		} catch (error) {
			this.log('error', `GET ${path} failed: ${error}`)
			return null
		}
	}

	private _updateVariableInterval: NodeJS.Timeout | undefined

	async startVariableUpdatePolling(): Promise<void> {
		if (this._updateVariableInterval) {
			clearInterval(this._updateVariableInterval)
			this._updateVariableInterval = undefined
		}

		this._updateVariableInterval = setInterval(() => {
			this.updateSystemInfoVariables().catch((err) => {
				this.log('error', `System info polling failed: ${err}`)
			})
		}, 1000)
	}

	//Variable Update Methods

	async updateSystemInfoVariables(): Promise<void> {
		const info = await this.apiGet('/system/about')
		if (!info) {
			this.log('error', 'Failed to retrieve /system/about')
			return
		}

		const getGain = (obj: any, field: string) => String(obj?.[field] ?? '')

		const variableValues: Record<string, any> = {
			currentFirmwareMode: String(info.currentFirmwareMode ?? ''),
			currentSystemMode: String(info.currentSystemMode ?? ''),
			device: String(info.device ?? ''),
			fpgaVersion: String(info.fpgaVersion ?? ''),
			frontPanelRevision: String(info.frontPanelRevision ?? ''),
			imageVersion: String(info.imageVersion ?? ''),
			jitterAdcSpan: String(info.jitterAdcSpan ?? ''),
			mainBoardRevision: String(info.mainBoardRevision ?? ''),
			mezzanineBoardRevision: String(info.mezzanineBoardRevision ?? ''),
			sha: String(info.sha ?? ''),
			softwareBranch: String(info.softwareBranch ?? ''),
			softwareNumber: String(info.softwareNumber ?? ''),
			softwareVersion: String(info.softwareVersion ?? ''),
			status: String(info.status ?? ''),
			timeOnUnit: String(info.timeOnUnit ?? ''),
			toolchainVersion: String(info.toolchainVersion ?? ''),
			message: String(info.message ?? ''),

			// Driver A-D
			driver_a_gain_1_5g: String(info.driver?.A?.['gain_1.5G'] ?? ''),
			driver_a_gain_3g: String(info.driver?.A?.['gain_3G'] ?? ''),
			driver_a_gain_6g: String(info.driver?.A?.['gain_6G'] ?? ''),
			driver_a_gain_12g: String(info.driver?.A?.['gain_12G'] ?? ''),

			driver_b_gain_1_5g: String(info.driver?.B?.['gain_1.5G'] ?? ''),
			driver_b_gain_3g: String(info.driver?.B?.['gain_3G'] ?? ''),
			driver_b_gain_6g: String(info.driver?.B?.['gain_6G'] ?? ''),
			driver_b_gain_12g: String(info.driver?.B?.['gain_12G'] ?? ''),

			driver_c_gain_1_5g: String(info.driver?.C?.['gain_1.5G'] ?? ''),
			driver_c_gain_3g: String(info.driver?.C?.['gain_3G'] ?? ''),
			driver_c_gain_6g: String(info.driver?.C?.['gain_6G'] ?? ''),
			driver_c_gain_12g: String(info.driver?.C?.['gain_12G'] ?? ''),

			driver_d_gain_1_5g: String(info.driver?.D?.['gain_1.5G'] ?? ''),
			driver_d_gain_3g: String(info.driver?.D?.['gain_3G'] ?? ''),
			driver_d_gain_6g: String(info.driver?.D?.['gain_6G'] ?? ''),
			driver_d_gain_12g: String(info.driver?.D?.['gain_12G'] ?? ''),

			// Eye
			eye_dcGain: String(info.eye?.dcGain ?? ''),
			eye_gain: String(info.eye?.gain ?? ''),
			eye_offset: String(info.eye?.offset ?? ''),
			eye_eyeCalRevision: String(info.eye?.eyeCalRevision ?? ''),

			// Eye display gains
			eye_display_gain_270m: getGain(info.eye?.displayGains, 'gain_270M'),
			eye_display_gain_1_5g: getGain(info.eye?.displayGains, 'gain_1.5G'),
			eye_display_gain_3g: getGain(info.eye?.displayGains, 'gain_3G'),
			eye_display_gain_6g: getGain(info.eye?.displayGains, 'gain_6G'),
			eye_display_gain_12g: getGain(info.eye?.displayGains, 'gain_12G'),

			// Eye measurement gains
			eye_measure_gain_270m: getGain(info.eye?.measurementGains, 'gain_270M'),
			eye_measure_gain_1_5g: getGain(info.eye?.measurementGains, 'gain_1.5G'),
			eye_measure_gain_3g: getGain(info.eye?.measurementGains, 'gain_3G'),
			eye_measure_gain_6g: getGain(info.eye?.measurementGains, 'gain_6G'),
			eye_measure_gain_12g: getGain(info.eye?.measurementGains, 'gain_12G'),
		}

		this.setVariableValues(variableValues)
	}
}

runEntrypoint(ModuleInstance, UpgradeScripts)
