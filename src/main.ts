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
}

runEntrypoint(ModuleInstance, UpgradeScripts)
